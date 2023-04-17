import { providers, Contract, ethers } from 'ethers'
import Auction from '../../hardhat/artifacts/contracts/DomainNameAuction.sol/DomainNameAuction.json'
import {priceToWei} from "./helpers";

export const auctionContractAddress = '0xEEECae611fd8EF96Ea131D25CB770D59C9004924'

export async function getContract() {

  let auctionContract

  try {
    const { ethereum } = window

    const provider = new providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    auctionContract = new Contract(auctionContractAddress, Auction.abi, signer)

  } catch (error) {
    console.log("ERROR:", error)
  }
  return auctionContract
}

export const createAuction = async (domainName, reservePrice, endTime) => {

  try {
    const contract = await getContract()
      const res = await contract.createAuction(domainName, priceToWei(reservePrice), endTime)
      return await res.wait()
  } catch (e) {
    console.log(e)
  }
}

export const getAuctions = async () => {
  try {
    const contract = await getContract()
    const domainCount = await contract.getDomainCount()

    let auctions = []

    for (let i = 0; i < domainCount; i++) {
      const auction = await contract.getAuction(i)
      auctions.push({
        owner: auction._owner,
        name: auction._name,
        highestBid: auction._highestBid,
        endTime: auction._endTime,
        ended: auction._ended,
      })
    }

    return auctions

  } catch (e) {
    console.log(e)
  }
}

export const bidAuction = async (index, value) => {

  try {
    const contract = await getContract()
    let res = await contract.bid(index, {value: priceToWei(value)})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const endAuction = async index => {

  try {
    const contract = await getContract()
    let res = await contract.endAuction(index)
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const startAuction = async (index, value) => {
  try {
    const contract = await getContract()
    let res = await contract.bid(index, {value: ethers.utils.parseEther(value)})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

