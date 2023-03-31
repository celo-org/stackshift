import React, { useState, useEffect, useRef  } from 'react'
import Image from "next/image"
import Link from "next/link"
import {
  bid, endAuction, refund, getHighestBidder,
  getOwnerBalance, getEndTime, getBidderAmount, updateEndtime
} from '@/interact'
import { useCelo } from '@celo/react-celo';
import Router from 'next/router';
import { BigNumber } from 'ethers';
import Countdown from "react-countdown";

export default function Home() {
  const [bidAmount, setBidAmount] = useState<string>('0')
  const [endtime, setEndtime] = useState<number>(0)
  const [ended, setEnded] = useState<boolean>(false)
  const [bidder, setHighestBidder] = useState<string>('Highest bidder address')
  const [update, setUpdate] = useState<string>('')
  const [ownerBalance, setOwnerBalance] = useState<number>(0)
  const { kit, address } = useCelo()

  const handleAmount = (e: React.FormEvent<HTMLInputElement>) => {
    setBidAmount(e.currentTarget.value)
    console.log(e.currentTarget.value)
  }
  const handleUpdateEndtime = (e: React.FormEvent<HTMLInputElement>) => {
    setUpdate(e.currentTarget.value)
    console.log(e.currentTarget.value)
  }
   
  const handleEndtimeUpdate = async () => {
    await updateEndtime(address, update, kit)
    setUpdate("")
    window.location.reload()
  }
  const handleEndtime = async () => {
    const end = await getEndTime(kit)
    setEndtime(end)
  }
  
  const handleHighestbidder = async () => {
    const bidder = await getHighestBidder(kit)
    setHighestBidder(bidder)
  }

  const handleOwnerBalance = async () => {
    const bal = await getOwnerBalance(kit)
    setOwnerBalance(bal as number)
  }

  const handleBidderAmount = async () => {
    const bid = await getBidderAmount(kit)
    setBidAmount(bid)
  }

  let d = new Date();
  const formatDate = new Date(endtime as number * 1000 + d.getTimezoneOffset() * 60000)
  console.log(formatDate)
  console.log(d.getTime())
 
  useEffect(() => {
    if (formatDate.getTime() < d.getTime()) {
      console.log("Bidding ongoing")
      setEnded(false)
    } else {
      console.log("bidding ended")
      setEnded(true)
    }
    handleOwnerBalance()
    handleBidderAmount()
    handleHighestbidder()
    handleEndtime()
  }, [kit])
 
  console.log(!ended)
 
  return (
    <div>
      <h1 className='text-4xl text-center m-4'>Decentralized Auction</h1>
      {!ended ? <div>
       <h1>Auction has ended. Click on the Update End time button to extend the Auction period.</h1>
        <input className='p-4 ml-4' type="number" placeholder='Update End Time' value={update} onChange={handleUpdateEndtime} />
        <button className="bg-slate-300 rounded-md p-4 mt-4" onClick={() => handleEndtimeUpdate()}>Update Endtime</button>
      </div> :
        <div>
          <div>
            <div className=' flex text-xl justify-around'>
              <h1 className='mr-4'>{`Bidding Ends on `}</h1>
              <h1 className='text-red-500'>{`${formatDate.toString().slice(0, 24)}`}</h1>
            </div>
            <div className=' flex text-xl justify-between'>
              <h1 className='tex-2xl mt-4'>Start bidding...</h1>
              <h1 className='tex-2xl mt-4'>{`Owner Balance: ${ownerBalance}`}</h1>
            </div>
  
            <input className='p-4' type="number" placeholder='Enter bid amount' value={bidAmount} onChange={handleAmount} />
            <button className="bg-yellow-300 rounded-md p-4 mt-4" onClick={() => bid(address, bidAmount, kit)}>Bid</button>

            <input className='p-4 ml-4' type="number" placeholder='Update End Time' value={update} onChange={handleUpdateEndtime} />
            <button className="bg-slate-300 rounded-md p-4 mt-4" onClick={() => handleEndtimeUpdate()}>Update Endtime</button>
          </div>

          <div className=" text-xl mt-4">
            <h1>{`Highest Bidder: ${bidder}`}</h1>
            <h1>{`Highest Bid: ${!bidAmount ? 0 : bidAmount}`}</h1>
            <div className='flex mt-4'>
              <button className="bg-yellow-300 rounded-md p-4 mt-4" onClick={() => endAuction(address, kit)}>End Auction</button>
              <button className="bg-green-300 rounded-md p-4 mt-4 ml-4" onClick={() => refund(address, kit)}>Refund Bid</button>
            </div>
          </div>
        </div>}    
    </div>
  )
}
