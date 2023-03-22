import { ethers } from 'ethers'
import { newKit } from '@celo/contractkit'
import { NODE_URL } from './constants'

const kit = newKit(NODE_URL)
const provider = new ethers.providers.Web3Provider(kit.web3.currentProvider)
console.log('provider ', provider)

export const contractAddress = '0xdE266E642e052F2e437F73Eeae379FEe2DA02201'

