import Web3 from "web3";
import { providers, Contract, ethers } from "ethers";
import abi from "./abi.json";
require("dotenv").config();

export async function getContract() {
  console.log("Auntion COntracts");
  const contractAddress = "0x09038FAF2178FF96Ce7fcE6e6eb253EF83D9dcb0";
  const contractABI = abi;
  let auctionTokenContract;
  try {
    const { ethereum } = window;
    console.log(ethereum.chainId);
    if (ethereum.chainId === "0xaef3") {
      const provider = new providers.Web3Provider(ethereum);
      console.log("provider", provider);
      const signer = provider.getSigner();
      auctionTokenContract = new Contract(contractAddress, contractABI, signer);
    } else {
      throw new Error("Please connect to the Alfajores network");
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  console.log(auctionTokenContract);
  return auctionTokenContract;
}

export async function Bid(amount, address) {
  // Approve the transfer of donation amount to the charity address

  const contract = await getContract();
  const approvalTx = await contract.approve(address, amount);
  console.log(await contract);
  console.log(await approvalTx);
  // Transfer tokens to another account
  const transferTx = await contract.transfer(address, amount);
  console.log("Transfer transaction hash: ", transferTx.transactionHash);
  const finalTx = await contract.acceptBid(amount, {
    value: amount,
  });
  console.log(finalTx);
  //   const finaleTx = await contract.withdrawChest();
  //   console.log(finaleTx);
}
