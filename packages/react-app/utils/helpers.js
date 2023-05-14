import {ethers, providers} from 'ethers'

export const truncate = input => `${input.substring(0, 5)}...${input.slice(-4)}`

export const toTimestamp = time => time ? (new Date(time)).getTime() : undefined

export const timestampToDate = ts => {
  if (!ts) return
  const d = new Date(ts)
  return `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

export const priceToWei = price => price ? ethers.utils.parseUnits(price.toString(), 'wei').toString() : 0

export const formatPrice = (price) => price ? ethers.utils.formatEther(String(price)) : ''

export const addressToLowerCase  = address => address?.toLocaleLowerCase()


export const hasNCT = async (walletAddress) => {
  const provider = new providers.Web3Provider(ethereum)
  // const tokenAddress = '0xB297F730E741a822a426c737eCD0F7877A9a2c22'
  const tokenAddress = '0xfb60a08855389f3c0a66b29ab9efa911ed5cbcb5'

  const token = new ethers.Contract(tokenAddress, ['function balanceOf(address) view returns (uint256)'], provider)
  const balance = await token.balanceOf(walletAddress)
  return balance.gt(0)
}