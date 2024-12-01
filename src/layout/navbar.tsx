import { Button } from "@/components/ui/button";
import ltoLogo from "../assets/lto-logo.avif";

const Navbar = () => {
  return (
    <nav
      className="flex items-center justify-between px-6 py-4"
      style={{ backgroundColor: "#18054B", color: "white" }}
    >
      <div className="flex items-center space-x-2 text-lg font-bold">
        <img src={ltoLogo} alt="LTO Logo" className="w-8 h-8" />
        <span>LTO Network</span>
      </div>
      <div className="flex space-x-4">
        {/* <a href="/" className="hover:text-slate-300">
          Home
        </a>
        <a href="/about" className="hover:text-slate-300">
          About
        </a>
        <a href="/debug" className="hover:text-slate-300">
          Debug
        </a> */}
      </div>
      <Button style={{ backgroundColor: "white", color: "#18054B" }} asChild>
        <a
          href="https://wallet.lto.network"
          target="_blank"
          rel="noopener noreferrer"
        >
          Wallet
        </a>
      </Button>
    </nav>
  );
};

export default Navbar;
