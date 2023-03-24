import contractABI from "./SplitPayment.json"
import { CONTRACT_ADDRESS } from "./utils/constants";
import Web3 from "web3";
import { newKitFromWeb3 } from "@celo/contractkit";
import { ethers } from "ethers"

const web3 = new Web3(window.ethereum || window.celo);
const kit = newKitFromWeb3(web3);


const contractInstance = new kit.web3.eth.Contract(contractABI.abi, CONTRACT_ADDRESS)

export async function addReceipients(account, receipient) {  
  try {
    const tx = await contractInstance.methods.addReceipients(receipient).send({
       from: account
     });
      console.log(tx);
  } catch (error) {
    console.log(error)
  }
}

export async function getReceipients() {
  try {
    const response = await contractInstance.methods.getReceipients().call()
    console.log("response ", response)
    return response
  } catch (error) {
    console.log(error)
  }
}

export async function clearReceipients(account) {
  try {
   const tx = await contractInstance.methods.clearRecipients().send({from: account})
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

export async function fundContract(account, amount) {
  try {
    const tx = await contractInstance.methods.fundContract()
      .send({ from: account, value: amount })
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

export async function splitFund(account) {
  try {
    const tx = await contractInstance.methods.split().send({from: account})
    console.log(tx)
  } catch (error) {
    console.log(error)
  }
}

export async function getBalance() {
  try {
    const response = await contractInstance.methods.contractBalance().call()
    console.log("response ", response)
    return response
  } catch (error) {
    console.log(error)
  }
}

