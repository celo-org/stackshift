import React from 'react'
import SupportersForm from './SupportersForm'
import Image from 'next/image';
interface IParams {
  id: number;
  username: string;
  ipfsHash: string;
  userbio: string;
  walletAddress: string;
}

export default function CreatorPage(param: IParams) {
  return (
    <div>
      <div className='flex'>
        <div className='flex px-48 pb-8'>          
          <Image className='rounded-full' src={`https://ipfs.io/ipfs/${param.ipfsHash}`} width="100" height={100} alt="profile-pix" />
          <div className='m-4'>
            <p className='text-xl'>{`Hi ${param.username}`}</p>
            <p> {param.userbio}</p>
          </div>
        </div>
        <div>
        </div>
      </div>
      <SupportersForm id={param.id} walletAddress={param.walletAddress} />
    </div>
  )
}
