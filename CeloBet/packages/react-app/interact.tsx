import celoBetABI from "./CeloBet.json"
import { WrapperBuilder } from  "@redstone-finance/evm-connector";
import { ethers } from "ethers";

const celoBetAddress = "0xe3713Ec8DaB16aeFB1e533B7F122643cc401FB48";
  
export function initContract(kit: any) {
  return new kit.connection.web3.eth.Contract(celoBetABI.abi, celoBetAddress)
} 

export const registerUser = async (address: string | null | undefined,
  kit: any) => {
  try {
    const txHash = await initContract(kit).methods
      .registerUser().send({
    from: address,
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const placeBet = async (address: string | null | undefined,
  kit: any, choice: string, amount: string) => {
  try {
    const txHash = await initContract(kit).methods
      .placeBet(choice).send({
        from: address,
        value: ethers.utils.parseUnits(amount).toString()
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const closeBet = async (address: string | null | undefined,
  kit: any) => {
  try {
     const wrappedContract = WrapperBuilder.wrap(initContract(kit)).usingDataService(
    {
      dataServiceId: "redstone-custom-urls-demo",
      uniqueSignersCount: 2,
      dataFeeds: ["0xc0ede6807bd5d9da"],
    },
    ["https://d1zm8lxy9v2ddd.cloudfront.net"]
  );

  // Interact with the contract (getting oracle value securely)
    // const res = await wrappedContract.closeBet().send({
    //   from: address
    // });
    const res = await wrappedContract.getCeloPrice()
    console.log(res)
  
    // const txHash = await initContract(kit).methods
    //   .closeBet().send({
    // from: address,
    // })
    // console.log(txHash)
  } catch (e) {
    console.log(e.message)
  }
}

export const getContractBalance = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.getContractBalance().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}

export const getUsers = async (kit: any) => {
  try {
    const response = await initContract(kit).methods.getUsers().call()
    console.log(response)
    return response;
  } catch (e) {
    console.log(e)
  }
}
