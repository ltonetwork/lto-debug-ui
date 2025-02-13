import axios from "axios";

export class RelayApi {
  async checkMessage(address: string, hash: string, env: string) {
    let url = "";

    if (env === "staging") {
      url = `http://relay-debug.eba-zrdkspxn.eu-west-1.elasticbeanstalk.com/debug/${address}/${hash}`;
    } else if (env === "prod") {
      url = `https://relay-dev.lto.network/debug/${address}/${hash}`;
    } else {
      throw new Error("Invalid environment specified");
    }

    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
    }
  }
}
