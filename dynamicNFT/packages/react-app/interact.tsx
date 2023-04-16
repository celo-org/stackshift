import DynamicNFT from "./DynamicNFT.json"
import { ethers } from "ethers"
const contractAddress = "0x8BFe2338CCA1A8317C3F8fe52Addf2D2135aCF45"

  
export function initContract(kit : any) {
  return new kit.connection.web3.eth.Contract(DynamicNFT.abi, contractAddress)
} 

export const deposit = async (address: string | null | undefined,
  kit: any, amount : string) => {
  try {
    const txHash = await initContract(kit).methods
      .depositFund().send({
        from: address,
        value: ethers.utils.parseUnits(amount, "ether").toString()
    })
    console.log(txHash)
    return {sucesss: true, data: txHash.transactionHash}
  } catch (e) {
    console.log(e)
    return {sucesss: false, message: e.message}
  }
}


export const getToken = async (kit: any, tokenIdURI: number) => {
  try {
    const response = await initContract(kit).methods.uri(tokenIdURI).call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const hasDeposited = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.hasDeposited().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const getUserSavings = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.getUserSavings().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}


