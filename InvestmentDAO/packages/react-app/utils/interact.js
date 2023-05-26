import { providers, Contract } from 'ethers'
import Lottery from '../TalentMarketPlace.json'
import { priceToWei } from './helpers'

export const contractAddress = '0x3f93F98ea70a887daaa5a3D8550aB9F7424BC220'

export async function getContract() {

  let contract

  try {
    const { ethereum } = window

    const provider = new providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    contract = new Contract(contractAddress, Lottery.abi, signer)

  } catch (error) {
    console.log("ERROR:", error)
  }
  return contract
}

export const createAccount = async (name, service, imagePath, description, serviceCharge) => {

  try {
    const contract = await getContract()
    const res = await contract.createVendor(name, service, imagePath, description, priceToWei(serviceCharge))
    return await res.wait()
  } catch (e) {
    console.log(e)
  }
}

export const getVendors = async () => {
  try {
    const contract = await getContract()
    const vendorCount = await contract.getVendorCount()

    let vendors = []

    for (let i = 0; i < vendorCount; i++) {
      const vendor = await contract.getVendors(i)
      vendors.push(vendor)
    }
    return vendors

  } catch (e) {
    console.log(e)
  }
}


export const getTransactions = async address => {
  try {
    const contract = await getContract()
    const txCount = await contract.getTransactionCount()

    let txs = []

    for (let i = 0; i < txCount; i++) {
      const tx = await contract.getTransactions(i, address)
      txs.push(tx)
    }
    return txs

  } catch (e) {
    console.log(e)
  }
}

export const getVendorTransactions = async address => {
  try {
    const contract = await getContract()
    const txCount = await contract.getVendorTransactionCount()

    let txs = []

    for (let i = 0; i < txCount; i++) {
      const tx = await contract.getVendorTransactions(i, address)
      txs.push(tx)
    }
    return txs

  } catch (e) {
    console.log(e)
  }
}

export const createTransaction = async (index, address, value) => {

  try {
    const contract = await getContract()
    let res = await contract.createTransaction(index, address, {value})
    res = await res.wait()
    return res

  } catch (e) {
    console.log(e)
  }
}

export const approve = async (index, vendorAddress) => {

  try {
    const contract = await getContract()

    let res = await contract.confirmService(index, vendorAddress)
    return await res.wait()


  } catch (e) {
    console.log(e)
  }
}

export const sendForReview = async (index, customerAddress) => {

  try {
    const contract = await getContract()

    let res = await contract.serviceReviewing(index, customerAddress)
    return await res.wait()


  } catch (e) {
    console.log(e)
  }
}


export const cancelService = async (index, customerAddress) => {

  try {
    const contract = await getContract()

    let res = await contract.cancelService(index, customerAddress)
    return await res.wait()


  } catch (e) {
    console.log(e)
  }
}

export const vendorCancelService = async (index, customerAddress) => {

  try {
    const contract = await getContract()

    let res = await contract.vendorCancelService(index, customerAddress)
    return await res.wait()


  } catch (e) {
    console.log(e)
  }
}

export const test = async () => {

  try {
    const contract = await getContract()
    // let res = await contract.getTime()
    let res = await contract.refundInProgressTransactions()
    console.log('test')
    console.log(res)

  } catch (e) {
    console.log(e)
  }
}
