import React from 'react'
import {usePrepareContractWrite,useContractWrite, useWaitForTransaction, useContractRead, useAccount } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'
import Link from 'next/link'
import { hexToNumber, truncate } from '@/utils/Truncate'
import { ethers } from 'ethers'
import Router from 'next/router'
import { convertEndTime, convertEnded, convertStartTime, dateToTimeStamp } from '@/utils/ConvertDate'

interface IParam {
  data: any[]
}
export default function TableList(param: IParam) {

  const { address } = useAccount()
  
    const proposals : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getAllProposals',
      chainId: 44787,
    })
  
   // Get voter status; check if a member has already voted for the proposal
  const Status = (id: number) => {
      const memberVoteStatus : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getMemberVoteStatus',
      chainId: 44787,
      args: [id, address]
      })
    return memberVoteStatus.data
  }

  
  // const voteStatus = memberVoteStatus && memberVoteStatus.data

  const votingPeriod = (item : any) => {
    if (dateToTimeStamp() < hexToNumber(item.startTime._hex)) {
      return convertStartTime(item.startTime._hex)
    } else if (dateToTimeStamp() < hexToNumber(item.endTime._hex)) {
      return convertEndTime(item.endTime._hex)
    } else if (dateToTimeStamp() > hexToNumber(item.endTime._hex)) {
      return convertEnded(item.endTime._hex)
    }
  }
  return (
    <div> 
      {param.data && param.data.length === 0 ?
        <div className='text-lg mt-4'>No proposal created!</div> :
        <div>
          <h1 className='text-lg mt-4 font-bold'>List of Proposals</h1>
          <div className="flex flex-col">
            <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
              <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
                <div className="overflow-hidden">
                  <table className="min-w-full text-left text-sm font-light">
                    <thead className="border-b font-medium dark:border-neutral-500">
                      <tr>
                        <th scope="col" className="px-6 py-4">#</th>
                        <th scope="col" className="px-6 py-4">Proposal</th>
                        <th scope="col" className="px-6 py-4">Creator Address</th>
                        <th scope="col" className="px-6 py-4">Voting Period</th>
                        <th scope="col" className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {param.data && param.data.map((item: any, index: number) =>
                        <tr key={index} onClick={() => Router.push({
                          pathname: `/proposals/${index}`,
                          query: {
                            id: hexToNumber(item.id._hex), creator: item.creator, title: item.title,
                            description: item.description, yesVotes: hexToNumber(item.yesVotes._hex),
                            noVotes: hexToNumber(item.noVotes._hex), startTime: hexToNumber(item.startTime._hex),
                            endTime: hexToNumber(item.endTime._hex)
                          }
                        })} className="border-b dark:border-neutral-500 cursor-pointer">
                          <td className="whitespace-nowrap px-6 py-4 font-medium">{hexToNumber(item.id._hex)}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.title}</td>
                          <td className="whitespace-nowrap px-6 py-4">{item.creator} <label className='text-green-500'>{Status(item.id._hex) ? "✔ Voted" : null}</label></td>
                          <td className="whitespace-nowrap px-6 py-4">{votingPeriod(item)}</td>
                          <td>
                            <div className={` ${dateToTimeStamp() < hexToNumber(item.startTime._hex) ? 'bg-slate-200' : dateToTimeStamp() <= hexToNumber(item.endTime._hex) ? "bg-green-200" : dateToTimeStamp() > hexToNumber(item.endTime._hex) ? "bg-red-200" : null}  rounded p-4`}>
                              {dateToTimeStamp() < hexToNumber(item.startTime._hex) ? 'Pending' : dateToTimeStamp() < hexToNumber(item.endTime._hex) ? "Active" : dateToTimeStamp() > hexToNumber(item.endTime._hex) ? "Closed" : null
                              }</div>
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      }
    </div>
  )
}
