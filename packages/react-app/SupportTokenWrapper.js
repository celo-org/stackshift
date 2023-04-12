import { abi } from "../hardhat/artifacts/contracts/DoAuctions.sol/DoAuctions.json";
import Web3 from "web3";
import { providers, Contract, ethers } from "ethers";

export async function getContract() {
    console.log("hey");
    const contractAddress = "0x9242c0acAF22C716022B5557EC441ee88960682b";
    const contractABI = abi;
    let supportTokenContract;
    try {
      const { ethereum } = window;
      console.log(ethereum.chainId);
      if (ethereum.chainId === "0xaef3") {
        const provider = new providers.Web3Provider(ethereum);
        console.log("provider", provider);
        const signer = provider.getSigner();
        supportTokenContract = new Contract(contractAddress, contractABI, signer);
      } else {
        throw new Error("Please connect to the Alfajores network");
      }
    } catch (error) {
      console.log("ERROR:", error);
    }
    console.log(supportTokenContract);
    return supportTokenContract;
  }
  
export async function donate(amount) {
  // Approve the transfer of donation amount to the charity address

  const contract = await getContract();

  console.log(await contract);
 // console.log(await approvalTx);
  const bidTx = await contract.bid(amount, {
    value: amount,
  });
  console.log(await bid);
}