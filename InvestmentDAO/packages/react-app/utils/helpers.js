import { ethers } from 'ethers'

export const truncate = input => input ? `${input.substring(0, 5)}...${input.slice(-4)}` : ''

export const toTimestamp = time => time ? (new Date(time)).getTime() / 1000 : undefined

export const timestampToDate = ts => {
  if (!ts) return
  const d = new Date(ts * 1000)
  return `${d.getDate()}/${(d.getMonth()+1)}/${d.getFullYear()} ${d.getHours()}:${d.getMinutes()}`
}

export const priceToWei = price => price ? ethers.utils.parseEther((price).toString()).toString() : 0

export const lotteryElapsed = timestamp =>  Date.now() / 1000 >= timestamp
