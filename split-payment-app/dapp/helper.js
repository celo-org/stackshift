import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { abi } from "./spilter.abi";

export const initializeContract = () => {
    const web3 = new Web3(window.celo);
    const kit = newKitFromWeb3(web3);

    const contractAddress = "0x1467F4e1dEaEe91a3095B69E6142Ff41c49812e2";

    const contract = new kit.connection.web3.eth.Contract(abi, contractAddress);

    return contract;
}