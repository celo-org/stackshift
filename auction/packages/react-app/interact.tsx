import { BigNumber } from "ethers";
import contractABI from "./Auction.json"
import { ethers } from "ethers";

const contractAddress = "0xe193E8Fa0629C745Db831d38661a2E82c5123d64";

export function donationContract(kit: any) {
  return new kit.connection.web3.eth.Contract(contractABI.abi, contractAddress)
} 
 
export const bid = async (address: string | null | undefined, amount: string, kit: any) => {
  try {
    const txHash = await donationContract(kit).methods.bid().send({
    from: address,
    value: ethers.utils.parseUnits(amount, "ether"),
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const endAuction = async (address: string | null | undefined, kit: any) => {
  try {
    const txHash = await donationContract(kit).methods.endAuction().send({
    from: address,
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const refund = async (address: string | null | undefined, kit: any) => {
  try {
    const txHash = await donationContract(kit).methods.refund().send({
    from: address,
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const updateEndtime = async (address: string | null | undefined, endtime: string, kit: any) => {
  try {
    const txHash = await donationContract(kit).methods.updateEndtime(endtime).send({
    from: address
    })
    console.log(txHash)
  } catch (e) {
    console.log(e)
  }
}

export const getHighestBidder = async (kit: any) => {
  try {
    const highestBidder = await donationContract(kit).methods.getHighestBidderAddress().call()
    console.log(highestBidder)
    return highestBidder;
  } catch (e) {
    console.log(e)
  }
}

export const getOwnerBalance = async (kit: any) => {
  try {
    const balance = await donationContract(kit).methods.getOwnerBalance().call()
    console.log(balance)
    const bal = balance/1e18
    return bal;
  } catch (e) {
    console.log(e)
  }
}

export const getEndTime = async (kit: any) => {
  try {
    const endTime = await donationContract(kit).methods.getEndTime().call()
    console.log(endTime)
    return endTime;
  } catch (e) {
    console.log(e)
  }
}

export const getBidderAmount = async (kit: any) => {
  try {
    const endTime = await donationContract(kit).methods.getBidderAmount().call()
    console.log(endTime)
    return endTime;
  } catch (e) {
    console.log(e)
  }
}


