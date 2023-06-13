import React, {useEffect, useState} from 'react'
import SupportersForm from './SupportersForm'
import { useQuery } from '@tanstack/react-query' 
import Image from 'next/image'
import { CONTRACT_ABI, CONTRACT_ADDRESS } from '@/Constants';
import { useContractRead } from 'wagmi';
import { useAccount } from 'wagmi';
interface IParams {
  id: number;
  username: string;
  ipfsHash: string;
  userbio: string;
  walletAddress: string;
}

export default function ProfilePage() {
  const [creator, setCreator] = useState<any>({})
  const { address } = useAccount()
    const { data, isLoading } = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getCreatorList',
      chainId: 44787,
  })

  useEffect(() => {
    if (data) {
      const value = data.find((item: any) => item.walletAddress === address)
      setCreator(value)
    }
  }, [address, data])

  return (
    <div>
      {creator !== undefined ?
       <div className='p-28'>
          <div className='flex px-48 pb-8'>          
            <Image className='rounded-full' src={`https://gateway.pinata.cloud/ipfs/${ data && creator.ipfsHash}`} width="100" height={100} alt="profile-pix" />
            <div className='m-4'>
              <p className='text-xl'>{`Hi ${ data && creator.username}`}</p>
              <p> { creator && creator.userbio}</p>
            </div>
          </div>
          <div>
        </div>
        {/* <SupportersForm id={ data && data.id -1} walletAddress={data &&  data.walletAddress} /> */}
    </div>
       : <div className='text-center p-60 text-2xl'>Loading data ...</div>}
      
    </div>
    
  )
}
