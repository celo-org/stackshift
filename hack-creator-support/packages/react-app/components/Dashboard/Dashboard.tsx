import React, { useEffect, useState} from 'react'
import CustomButton from '../CustomButton'
import DashboardTab from './DashboardTab'
import WithdrawModal from '../Modal/WIthdrawModal'
import { getCreators } from '../../utils/CeloInteract'
import { useQuery } from '@tanstack/react-query' 
import ShareButton from '../ShareButton'
import { useAccount } from 'wagmi'
import { useRouter } from 'next/router'
import { removeSpace } from '../../utils/truncate'

export default function Dashboard(): JSX.Element{
  const { address } = useAccount()
  const {route} = useRouter()
  
   const {isLoading, isError, data  } = useQuery({
    queryKey: ['creator'],
    queryFn: async () => {
      const creators = await getCreators(kit)
      return creators.find(item => item.walletAddress === address)
    }
   })

  console.log('data ', data)
  if (isLoading) {
     return <div className='text-center p-60 text-2xl'>Loading data ...</div>
  }

  return (
    <div>
      {data !== undefined ? 
        <div className='bg-gray-800 p-36 m-24 rounded-md'>
      <div className='flex justify-between'>
        <div className='flex'>          
          <img className='rounded-full' src={data === undefined ? undefined : `https://ipfs.io/ipfs/${data.ipfsHash}`} width="100px" alt="profile-pix" />
          <div className='m-4'>
            <p>{`Hi ${data === undefined ? "" : data.username}`}</p>
            <p>{`Dsupport.vercel.app/${data === undefined ? undefined : data.username}`}</p>
          </div>
        </div>
        <div>
          <ShareButton username={data.username}/>          
          <CustomButton text='Withdraw' myStyle='bg-amber-500 mt-4' targetValue='#withdrawModal' toggleValue='modal'/>
          <WithdrawModal id={data.id -1} walletAddress={data.walletAddress} />
        </div>
      </div>
        <DashboardTab
          id={data.id -1}
          username={data.username}
          userbio={data.userbio}
          walletAddress={data.walletAddress}
          ipfsHash={data.ipfsHash}
          donationsReceived={data.donationsReceived/1e18}
          supporters={data.supporters}       
        />
    </div>
      :<div className='text-center p-60 text-2xl'>Please hold on this may take a  while ...</div>}
    
    </div>   
  )
}
