// @ts-nocheck
import React, { useState, useEffect, useRef } from 'react'
import {
  bid, setEndtime,
  getAuction,
} from '../AuctionWrapper'

import { useAccount } from 'wagmi'
import { ethers } from 'ethers'

export default function Home() {
  const { address, isConnected } = useAccount()

  const [endtime, setEndtime] = useState<number>(0)
  const [remaining, setRemaining] = useState<number>(0)
  const [finished, setFinished] = useState<boolean>(false)

  const [bidAmount, setBidAmount] = useState<string>('0')

  const [topBid, setTopBid] = useState<number>(0)
  const [topBidder, setTopBidder] = useState<string>('0x')

  const [ownerBalance, setOwnerBalance] = useState<number>(0)

  const onChangeBidAmount = (e) => {
    setBidAmount(e.currentTarget.value)
    console.log("Bid Amount: ", e.currentTarget.value)
  }

  const onClickBidButton = () => {
    if(bidAmount <= topBid) {
      alert("your bid must be more than the current top bid")
      return
    }

    bid(bidAmount)
      .then(success => {
        console.log("success: ", success)
        alert("your bid is successful")
      })
      .catch(error => {
        console.log("error: ", error)
      }) 

  }


  const doGetAuction = async () => {
    try {
      const auction = await getAuction()

      setTopBid(ethers.utils.formatEther(auction._topBid))
      setTopBidder(auction._topBidder.toString())

      // check current time vs auction's endtime
      let d = new Date();
      const endtimeFormatted = new Date(auction._endtime.toNumber() * 1000 + d.getTimezoneOffset() * 60000)
      console.log("endtime: ", endtimeFormatted)
      console.log("current time: ", d)

      setEndtime(endtimeFormatted.getTime())

      if (endtimeFormatted.getTime() > d.getTime()) {
        console.log("auction is not finished")
        setFinished(false)
        setRemaining((endtimeFormatted.getTime() - d.getTime()) / 3600000)
      } else {
        console.log("auction is finished")
        setFinished(true)
        setRemaining(0)
      }

    } catch (e) {
      console.log(e)
    }

  }

  // on page load
  useEffect(() => {
    doGetAuction()
  }, [])

  useEffect(() => {
    console.log("address: ", address)
  }, [address])

  return (
    <>
      <div className="p-2">
        <b>Auction</b>
        {finished ? <div>Finished</div>: <div>Open</div>}<br />
        endtime: <span>closing in {remaining.toFixed(2)} hours</span><br />
        topBid: {topBid} CELO<br />
        topBidder: {topBidder}<br />
      </div>
      <div className="p-2">
        <input className='p-2' type="number" placeholder='Bid Amount' value={bidAmount} onChange={onChangeBidAmount} />
        <button className="bg-green-300 p-2" onClick={onClickBidButton}>Bid</button>
      </div>
    </>
  )
}