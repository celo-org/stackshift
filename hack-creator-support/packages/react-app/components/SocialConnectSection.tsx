import React from 'react'
import People from '../images/people.png'
import Image from 'next/image'
  
export default function SocialConnectSection() {
  return (
    <div className='my-36 text-slate-300' >
      <h1 className='text-3xl font-bold text-center'>🥬  Social Connect Feature 🥬 </h1>
      <div className='grid grid-cols-2 justify-between'>
        <div>
          <p className='text-xl my-8'>
        Thanks to our partner Integrations. You can now receive support from your fans
        using your social identifier like your connected twitter account that is mapped
        to your connected wallet address.

        We have also provided you the option to connect using Masa.
        And also resolve your connected wallet address using the Masa resolve feature.
        And Get your self a soulbound name. i.e alex.celo.
        Click on the buttons below to link your address. 
        </p> 
        <div className='flex justify-left my-8 text-white'>
        <button className='bg-blue-500 p-4 rounded'>Map your Identifier</button>
        <button className='bg-yellow-500 ml-2 p-4 rounded '>Revoke Mapping</button>
        </div>
        </div>
        <Image src={People} alt='connect' width={600} height={200}/>
      </div>
      
    </div>
  )
}
