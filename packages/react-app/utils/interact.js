import { providers, Contract, ethers } from 'ethers'
import { priceToWei } from './helpers'
import Auction from '../../hardhat/artifacts/contracts/JustinNFT.sol/JustinNFT.json'

export const auctionContractAddress = '0x6361afB7A61E8C3FcF366C818F38EEbC78D30371'

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

export const createNFT = async (NFTURI, price) => {
  try {
    const contract = await getContract()
    const res = await contract.createNFT(NFTURI, price)
    return await res.wait()
  } catch (e) {
    console.log(e)
  }
}

export const createAuction = async (domainName, reservePrice, endTime) => {
  try {
    const contract = await getContract()
      const res = await contract.createAuction(domainName, ethers.utils.parseEther(reservePrice.toString()), endTime)
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
    console.log('auctions ', auctions)
    return auctions

  } catch (e) {
    console.log(e)
  }
}

export const buyProduct = async (index, price, address) => {

  try {
    const contract = await getContract()
    let res = await contract.buyProduct(auctionContractAddress, index, {value: priceToWei(price)})
    res = await res.wait()
    console.log('bidd ', res)
    return res

  } catch (e) {
    console.log(e)
  }
}

export const getProducts = async () => {

  try {
    const contract = await getContract()
    return await contract.getProducts()

  } catch (e) {
    console.log(e)
  }
}


