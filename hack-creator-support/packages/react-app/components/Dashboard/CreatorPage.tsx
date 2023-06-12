import React from 'react'
import SupportersForm from './SupportersForm'
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
          <img className='rounded-full' src={`https://ipfs.io/ipfs/${param.ipfsHash}`} width="100px" alt="profile-pix" />
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
