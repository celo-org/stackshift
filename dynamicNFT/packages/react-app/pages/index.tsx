import React, { useState, useEffect, useCallback  } from 'react'
import {
   deposit, getToken, getUserSavings, hasDeposited
} from '@/interact'
import { useCelo } from '@celo/react-celo';
import Image from 'next/image';
import axios from 'axios';

export default function Home() {
  const [Nft, setNft] = useState<string>("")
  const [amount, setAmount] = useState<string>("0")
  const [balance, setBalance] = useState<number>(0)
  const [exist, setExist] = useState<boolean>(false)

  const { kit, address } = useCelo()

  const handleAmount = (e: React.FormEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value)
  }
  const makeDeposit = useCallback(async () => {
    await deposit(address, kit, amount)
  }, [address, kit, amount])

  const hasDeposit = async () => {
    const res = await hasDeposited(kit)
    setExist(res)
  }
  
  const getBalance = useCallback(async ()  => {
    const res = await getUserSavings(kit)
    // if (!res) {
    //   return null
    // } else {
    //   setBalance(res)
    // }
    setBalance(res)
    console.log(res)
  }, [kit])

  const getNFT = useCallback(async () => {
    let tokenURI  : string = ''
    if (balance <= 1) {
      tokenURI = await getToken(kit, 1)
    } else if (balance >= 2 && balance < 3) {
      tokenURI = await getToken(kit, 2)
    }
    // else if (balance >= 3) {
    //   tokenURI = await getToken(kit, 3)
    // } 
   const response = await axios.get(tokenURI)
  setNft(response.data.image)
  }, [kit])

  useEffect(() => {
    hasDeposit()
    getBalance()
    getNFT()
  },[])

  return (
    <div>
      <div>
          {!address ? <div>Please connect your wallet</div> : 
        <div>
            <h1 className='text-4xl text-center m-4'>Dynamic NFT</h1>
            {!exist ? null : <Image src={Nft} alt='nft' width="200" height="200" />}  
            <h1>{`Total Savings: ${balance && balance/1e18} CELO`}</h1>
            <input className='p-4 border-1 ' type='number' placeholder='deposit fund' required value={amount} onChange={handleAmount}/>
            <button onClick={makeDeposit} className='bg-green-500 p-4 border rounded'>Deposit Fund</button>   
        </div>      
      }
      </div>
    
    </div>   
  )
}
