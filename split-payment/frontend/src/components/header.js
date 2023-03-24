import React from 'react'
import CeloLogo from '../images/celo-logo.png'
import { useCelo } from '@celo/react-celo'

export default function Header() {
  const { address, connect, disconnect } = useCelo()

  return (
    <div className='bg-yellow w-full p-4 flex justify-between'>
      <img src={CeloLogo} width="100px" alt="celo logo" />
      <div className='flex'>
        {!address ?
          <button onClick={connect} className='bg-black px-4 text-white border rounded'>Connect Wallet</button>
          : 
          <div className='flex'>
            <button className='text-black border border-black rounded mx-2 px-4'>{`connected to ${address.substring(0, 10)}...`}</button>
            <button onClick={disconnect} className='bg-black px-4 text-white border rounded'>Disconnect</button>
          </div>
        }
         
      </div>

    </div>
  )
}
