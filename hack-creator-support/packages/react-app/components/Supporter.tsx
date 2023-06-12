import React from 'react'
import UserGuide from './UserGuide'
import CircleWallet from '../images/circle-wallet.svg'

export default function Supporter() {
  return (
    <div className='mt-24'>
      <h3 className='text-center text-3xl p-4'>🖐  Are you a Supporter? 🖐 </h3>
      <p className='text-center lg:px-48 py-4 lg:text-xl md:text-lg sm:text-base'>Encourage  and support the works of creators you admire so that they can do more.  
<br/>All you have to do is to send in your support to them. </p>
      <div className='grid lg:grid-cols-3 md:grid-cols-1 sm:grid-cols-1 justify-center '> 
        <UserGuide image={CircleWallet}
          title='Connect Wallet'
          description='We have variety of wallet connection options.
                    Connect to your wallet of choice'/>
        
        <UserGuide image={CircleWallet}
          title='Select a Creator'
          description='select the creator you want to support 
        from our list of creator or directly using the creator link'/>

        <UserGuide image={CircleWallet}
          title='Send Your Support'
          description='select the creator you want to support 
        from our list of creator or directly using the creator link'/>
      </div>
    </div>
  )
}
