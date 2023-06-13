import React, { useEffect, useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import Creator from './Creator'
import { getAllCreators, getCreators } from '../utils/CeloInteract'
import SupporterModal from './Modal/SupporterModal'
import { convertHexToNumber, truncate } from '../utils/truncate'
import { useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants'

export default function FeaturedCreators() {  
  const [creators, setCreators] = useState<any[]>([])

  const {data} = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getCreatorList',
      chainId: 44787,
  })

  useEffect(() => {
    setCreators(data as any[])
  }, [data])

  return (
    <div>
      {creators === undefined || creators.length === 0 ? <div></div> : 
        <div>
          <h3 className='text-center text-3xl'>Featured Creators</h3>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center p-8 '>
            {creators && creators.map((creator, index) => <div className='mx-2' key={index}>
              <Creator
                id={convertHexToNumber(creator.id) - 1}
                name={creator.username}
                bio={creator.userbio}
                earnings={(convertHexToNumber(creator.donationsReceived)/1e18) }
                currency="CELO" supporters={convertHexToNumber(creator.supporters)}
                image={`https://gateway.pinata.cloud/ipfs/${creator.ipfsHash}`}
                creatorAddress={creator.walletAddress}              
              />
             {/* <SupporterModal myId={creator.id} username={creator.username} walletAddress ={creator.creatorAddress} /> */}
            </div>
            )}       
          </div>
          <p className='text-center text-2xl pb-4'>See more...</p>
        </div>
      }
    </div>
  )
}
