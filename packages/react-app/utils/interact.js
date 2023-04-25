import { providers, Contract } from 'ethers'
import axios  from 'axios'
import { WrapperBuilder } from 'redstone-evm-connector'
import { priceToWei } from './helpers'
import JustinNFT from '../../hardhat/artifacts/contracts/JustinNFT.sol/JustinNFT.json'

export const contractAddress = '0xAe30F2C23509C09e51ed6ED5f3d8608bfDCf9B4c'

export async function getContract() {

  let auctionContract

  try {
    const { ethereum } = window

    const provider = new providers.Web3Provider(ethereum)
    const signer = provider.getSigner()
    auctionContract = new Contract(contractAddress, JustinNFT.abi, signer)

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

export const buyProduct = async (index, price) => {

  try {
    const contract = await getContract()

    const wrappedContract = WrapperBuilder
      .wrapLite(contract)
      .usingPriceFeed('redstone-custom-urls-demo', { asset: '0xf2384121b725bca1' })

    // await wrappedContract.authorizeProvider();

    let res = await wrappedContract.buyProduct(contractAddress, index, {value: priceToWei(price)})

    // let res = await contract.buyProduct(contractAddress, index, {value: priceToWei(price)})
    res = await res.wait()
    console.log('bidd ', res)
    return res
  } catch (e) {
    console.log(e)
    console.log('e here', e)
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

export const getNFT = async () => {

  try {
    // let NFT = undefined
    const contract = await getContract()
    const tokenId = await contract.getTokenId()
    // return console.log('tt ', tokenId)
    // if (tokenId) {
      const tokenURI = await contract.tokenURI(tokenId)
      let NFT = await getNFTMeta(tokenURI)
    // }
    return NFT

  } catch (e) {
    console.log(e)
  }
}

export const getNFTMeta = async URI => {
  try {
    return (await axios.get(URI)).data
  } catch (e) {
    console.log({ e })
  }
}


