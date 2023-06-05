import React, { useState } from 'react'
import { useRouter } from 'next/router'
import VotersList from '@/components/VotersList'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import { hexToNumber, truncate } from '@/utils/Truncate'
import { formatTimestamp, dateToTimeStamp } from '@/utils/ConvertDate'
import { useAccount } from 'wagmi'
import { ParsedUrlQuery } from 'querystring'

export default function Proposal() {
  const [selected, setSelected] = useState<string>("")
  const router = useRouter()
  interface QueryParams extends ParsedUrlQuery{
    id: string;
    creator: string;
    title: string;
    description: string;
    startTime: string;
    endTime: string;
    noVotes: string;
    yesVotes: string;
  }
  const query = router.query as QueryParams
  console.log(query.creator)

  const {
    id,
    creator,
    title,
    description,
    startTime,
    endTime,
    noVotes,
    yesVotes } = query
  
  const { address } = useAccount()

  console.log(address)
  // Vote choice
   const choices = [
    { text: 'YES', value: 1 },
    { text: 'NO', value: 0 }
   ]

  // Config Vote
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'vote',
    args: [id, selected],
  })

  // handle vote state
  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
  })

  // Radio button selection
  const handleSelected = (e: React.FormEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.value)
    console.log(e.currentTarget.value)
  }

  const handleSubmit = () => {
    if (!selected) {
      alert("please make a choice")
    } else {
      write?.()
    }

  }

  // Get voters
  const voters : any = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'getVoters',
    chainId: 44787,
  })
  
  // Filter all voters on a proposal
  const votersList = voters.data && voters.data.filter((item: any) => hexToNumber(item.proposerIndex).toString() == id)
  const voterLength = votersList && votersList.length !== "NaN"
  
   // Get voter status; check if a member has already voted for the proposal
  const memberVoteStatus : any = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'getMemberVoteStatus',
    chainId: 44787,
    args: [id, address]
  })
  
  const voteStatus = memberVoteStatus && memberVoteStatus.data

  const tokenBalance = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'getTokenBalance',
    chainId: 44787,
    args: [address]
  })
  const balance: any = tokenBalance && tokenBalance.data
  console.log(`balance ${balance && hexToNumber(balance._hex) / 1e18}`)
  
  if (startTime === undefined) {
    return null
  }else

  return (
    <div>
      <div>
        <h1 className='text-3xl font-bold my-4'>{title}</h1>
        <div className='my-4'>
          <label className={` 
            ${dateToTimeStamp() < parseInt(startTime)  ? 'bg-slate-200' :
            dateToTimeStamp() <= parseInt(endTime) ? "bg-green-200" :
            dateToTimeStamp() > parseInt(endTime) ? "bg-red-200" : null}  rounded-full p-2`}>
            {dateToTimeStamp() < parseInt(startTime) ? 'Pending' :
            dateToTimeStamp() < parseInt(endTime) ? "Active" :
            dateToTimeStamp() > parseInt(endTime) ? "Closed" : null
            }</label>
          <label className='font-bold ml-2'>by</label>
        <label className='mx-2'>{creator}</label>
        </div>
    
        <p className='text-lg my-4'>{description}</p>
      </div>
      <div className='flex justify-around'>
        <div className='border-2 p-4 rounded'>
        <h1 className='border-b pb-2 text-lg font-bold'>Cast your vote</h1>
        <div className='py-2 border-b cursor-pointer'>
           {choices.map((item, index) => <div key={index}>
              <input className='mx-2' type="radio"  value={item.value} name='choice' checked={selected === item.value.toString()}
          onChange={handleSelected} />
              <label className='text-lg'>{`${item.text} - ${title} `}</label>
            </div>                    
            )}
          </div>
          {balance &&  hexToNumber(balance._hex) <= 0 ? <p className='text-red-400 my-4'>You need MT token to vote!</p> : null}
          <button
            onClick={handleSubmit}
            className={`${voteStatus || dateToTimeStamp() < parseInt(startTime) || dateToTimeStamp() > parseInt(endTime) || balance && hexToNumber(balance._hex) <= 0
              ? "bg-slate-200 " : "bg-green-500 "} rounded w-full p-4`}
            disabled={voteStatus ||dateToTimeStamp() < parseInt(startTime) || dateToTimeStamp() > parseInt(endTime) ? true : false}>Vote</button>
        </div>

          <div className='border-2 p-4 rounded'>
            <h1 className='border-b pb-2 text-lg font-bold'>Current results</h1>
          <div className='py-2 border-b'>
            <p>{`Yes ${parseInt(yesVotes) * 100/voterLength}%`}</p>
            <progress id="result" value={`${parseInt(yesVotes) * 100/voterLength}`} max="100"></progress>
            </div>
            <div className='py-2 border-b'>
            <p>{`No ${parseInt(noVotes) * 100/voterLength}%`}</p>
            <progress className='border rounded'  id="result" value={`${parseInt(noVotes) * 100/voterLength}` } max="100"></progress>

          </div>
          <div>
            <label className='font-bold'>Start time: </label>
            <label>{formatTimestamp(parseInt(startTime)) }</label>
          </div>
           <div>
            <label  className='font-bold'>End time: </label>
            <label>{formatTimestamp(parseInt(endTime)) }</label>
          </div>
        </div>
      </div>
       <VotersList voters={votersList}/>
    </div>
  )
}
