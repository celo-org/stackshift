import { BigNumber } from "ethers";
import contractABI from "../CeloDonation.json"

const contractAddress = "0x5Dcab164069A6DaC5F09F2820bF7dd5BA0e213b8";

export function donationContract(kit: any) {
  return new kit.connection.web3.eth.Contract(contractABI.abi, contractAddress)
} 
 
 /*
    * Save the new feed to the blockchain
    */
export const createCreator = async (address: string | null | undefined, username: string,
  profilePixUrl: string, userBio: string, network: string, kit: any) => {
  
  const txHash = await donationContract(kit).methods.setCreatorDetail(
    username, profilePixUrl, userBio, network
  ).send({
    from: address,
    gasLimit:'2100000'
  })
  console.log(txHash)
}

export const sendTip = async (address: string | null | undefined, message: string, index : number, amount: BigNumber, kit: any) => {
  const txHash = await donationContract(kit).methods.sendTip(message, index).send({
    from: address,
    value: amount,
    gasLimit: '2100000'
  })
  console.log(txHash)
}
// get all creators
export const getAllCreators = async (kit: any) => {
  const creatorCount = await donationContract(kit).methods.getCreatorCount().call()

  const creators  = []
  for (let i = 0; i < creatorCount.length; i++){
    let creator = await donationContract(kit).methods.getCreatorInfo(i).call()
    console.log(creator)
    creator.index = i;
    console.log(creator.index = i)
    creators.push(creator)
  }
  return creators;
}

// Use this
export const getCreators = async (kit: any) => {
  const creatorCount = await donationContract(kit).methods.getCreatorList().call()
  console.log(creatorCount)
  return creatorCount;
}


export const getCreator = async (index: number, kit: any) => {
  const creatorObj = await donationContract(kit).methods.getCreatorObj(index).call() 
  // const creatorObj = await donationContract.methods.getCreatorInfo(index).call() 
  console.log(creatorObj)
  return creatorObj;
}

export const getCreatorSupporterCount = async (kit: any) => {
  const supportersCount = await donationContract(kit).methods.getSupporters().call()
  console.log(supportersCount)
  return supportersCount
}

export const creatorWithdrawTip = async(address: string | null | undefined, index: number, amount: BigNumber, kit: any) => {
  const txHash = await donationContract(kit).methods.creatorWithdrawTip(index, amount).send({
     from: address,
    gasLimit:'2100000'
  })
  console.log(txHash)
}

export const getCreatorBal = async (index : number, kit: any) => {
  const earnings = await donationContract(kit).methods.getCreatorBal(index).call()
  console.log(earnings)
  return earnings
}
