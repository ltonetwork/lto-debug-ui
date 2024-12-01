import { useEffect, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Timeline from "@/components/timeline";
import ltoLogo from "../assets/lto-logo.avif";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { ObuilderApi } from "@/common/api/obuilder.api";
import { RelayApi } from "@/common/api/relay.api";

const Debug = () => {
  const [requestId, setRequestId] = useState("");
  const [address, setAddress] = useState("");
  const [hash, setHash] = useState("");
  const [env, setEnv] = useState("staging");
  const [network, setNetwork] = useState("T");
  const [steps, setSteps] = useState([
    { label: "Stage 1: Obuilder queue", completed: false },
    { label: "Stage 2: Processing", completed: false },
    { label: "Stage 3: Ready", completed: false },
    { label: "Stage 4: Sent", completed: false },
    { label: "Stage 4: Message Arrived", completed: false },
  ]);
  const [isPolling, setIsPolling] = useState(false);

  const handleSearch = useCallback(async () => {
    console.log(
      "Searching for code:",
      requestId,
      "Env:",
      env,
      "Network:",
      network
    );

    if (!requestId) return;

    setIsPolling(true);

    const obuilderApi = new ObuilderApi();
    const relayApi = new RelayApi();

    try {
      const obuilderResponse = await obuilderApi.track(requestId, network, env);
      console.log(obuilderResponse);

      // Update steps based on initial response
      const updatedSteps = steps.map((step, index) => ({
        ...step,
        completed: index < obuilderResponse[0].ownableStatus,
      }));
      console.log(updatedSteps);
      setSteps(updatedSteps);

      if (obuilderResponse[0].ownableStatus < 4) {
        // Obuilder still in progress
      } else {
        console.log("Obuilder completed, checking Relay API...");
        setAddress(obuilderResponse[0].ltoWallet);
        setHash(obuilderResponse[0].hash);

        let relayResponse = false;
        let retryCount = 0;
        const maxRetries = 3;

        while (!relayResponse && retryCount < maxRetries) {
          console.log(`Relay attempt ${retryCount + 1}`);
          try {
            relayResponse = await relayApi.checkMessage(address, hash, env);
          } catch (error) {
            console.error(
              `Relay check failed on attempt ${retryCount + 1}:`,
              error
            );
          }
          retryCount++;
          if (!relayResponse && retryCount < maxRetries) {
            console.log("Retrying relay check...");
            await new Promise((resolve) => setTimeout(resolve, 2000));
          }
        }

        if (relayResponse) {
          const currentStep = 5;
          console.log("Relay task completed!");
          const updatedSteps = steps.map((step, index) => ({
            ...step,
            completed: index < currentStep,
          }));
          console.log(updatedSteps);
          setSteps(updatedSteps);
          setIsPolling(false);
        } else {
          console.error("Relay task failed after maximum retries.");
          setIsPolling(false);
        }
      }
    } catch (error) {
      console.error("Error while tracking:", error);
      setIsPolling(false);
    }
  }, [requestId, network, env, steps]);

  useEffect(() => {
    if (!isPolling) return;

    const interval = setInterval(() => {
      handleSearch();
    }, 2000);

    return () => clearInterval(interval);
  }, [handleSearch, isPolling]);

  return (
    <div className="relative min-h-screen bg-slate-50">
      {/* Background Images */}
      <div className="absolute inset-0 overflow-hidden">
        <img
          src={ltoLogo}
          alt="Background 1"
          className="absolute top-10 left-10 w-20 h-20 sm:w-32 sm:h-32 object-cover blur-xl opacity-60"
        />
        <img
          src={ltoLogo}
          alt="Background 2"
          className="absolute bottom-10 right-10 w-24 h-24 sm:w-40 sm:h-40 object-cover blur-xl opacity-60"
        />
        <img
          src={ltoLogo}
          alt="Background 3"
          className="absolute top-1/2 left-1/3 w-32 h-32 sm:w-48 sm:h-48 object-cover blur-xl opacity-60 transform -translate-x-1/2 -translate-y-1/2"
        />
      </div>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen p-4">
        <h1 className="text-xl sm:text-2xl font-bold mb-2 text-[#18054B]">
          Track your Ownable
        </h1>
        <p className="text-sm sm:text-base mb-6 text-center">
          Paste your request Id, select the network and environment, then click
          TRACK!
        </p>

        {/* Input and Search Button */}
        <div className="flex flex-wrap w-full max-w-md space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          <Input
            value={requestId}
            onChange={(e) => setRequestId(e.target.value)}
            placeholder="RequestId"
            className="w-full sm:flex-1 h-12 sm:h-14 text-base sm:text-lg px-4 py-2"
          />
          <Button
            onClick={handleSearch}
            className="w-full sm:w-auto h-12 sm:h-14 bg-[#18054B] text-white text-sm sm:text-lg"
          >
            Track
          </Button>
        </div>

        {/* Environment and Network Dropdowns */}
        <div className="flex flex-wrap w-full max-w-md space-y-4 sm:space-y-0 sm:space-x-4 mb-6">
          {/* Environment Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto h-12  bg-[#18054B] text-white text-sm sm:text-lg">
                Environment: {env.charAt(0).toUpperCase() + env.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setEnv("staging")}>
                Staging
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setEnv("prod")}>
                Production
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Network Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className="w-full sm:w-auto h-12 bg-[#18054B] text-white text-sm sm:text-lg">
                Network: {network.charAt(0).toUpperCase() + network.slice(1)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={() => setNetwork("L")}>
                Mainnet
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => setNetwork("T")}>
                Testnet
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Timeline */}
        <Timeline steps={steps} />
      </div>
    </div>
  );
};

export default Debug;
