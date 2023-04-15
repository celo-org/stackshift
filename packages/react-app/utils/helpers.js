import { ethers } from 'ethers'

export const truncate = input => `${input.substring(0, 5)}...${input.slice(-4)}`

export const toTimestamp = time => time ? (new Date(time)).getTime() : undefined

export const timestampToDate = ts => {
  if (!ts) return
  const d = new Date(ts)
  return `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

// export const priceToWei = price => price ? ethers.utils.parseEther(price.toString()) : 0
export const priceToWei = price => price ? ethers.utils.parseUnits(price.toString(), 'wei').toString() : 0

export const formatPrice = (price) => price ? ethers.utils.formatEther(String(price)) : ''

export const toCheckSum  = (kit, address) => kit.connection.web3.utils.toChecksumAddress(address)