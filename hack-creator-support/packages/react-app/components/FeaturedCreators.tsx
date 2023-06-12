import React from 'react'
import { useQuery } from '@tanstack/react-query'
import Creator from './Creator'
import { getAllCreators, getCreators } from '../utils/CeloInteract'
import SupporterModal from './Modal/SupporterModal'
import { truncate } from '../utils/truncate'

export default function FeaturedCreators() {  
      
  const { isLoading, error, data } = useQuery({
      queryKey: ['repoData'],
      queryFn: async () => await getCreators()
    })
    if (isLoading) {
      <div> loading...</div>
    }
    if (error) {
        return <div>{`Error ${error}`}</div>
    }
    console.log(data)
  return (
    <div>
      {data === undefined || data.length === 0 ? <div></div> : 
        <div>
          <h3 className='text-center text-3xl'>Featured Creators</h3>
          <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 justify-center p-8 '>
            {data.map((creator, index) => <div className='mx-2' key={index}>
              <Creator
                id={creator.id -1 }
                name={creator.username}
                bio={creator.userbio}
                earnings={creator.donationsReceived/1e18 }
                currency="MATIC" supporters={creator.supporters}
                image={`https://ipfs.io/ipfs/${creator.ipfsHash}`}
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
