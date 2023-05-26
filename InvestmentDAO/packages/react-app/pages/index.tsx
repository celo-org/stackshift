import { useEffect, useState } from 'react'
import Image from 'next/image'

const Home = () => {

  const [vendors, setVendors] = useState<UserData | undefined>(undefined)



  return (
    <>
      <div className="flex items-center">
        <div className="flex-1">
          <h1 className="font-extrabold text-5xl">Unlocking the Power of Decentralized Investing</h1>
          <p className="my-8">
            Join us today and be part of the decentralized investing revolution! Powered by Celo blockchain.
          </p>
        </div>
        <Image className="flex-1 w-16 md:w-32 lg:w-48" src={require('/assets/img/guest-hero.png')}/>
      </div>
    </>
  )
}

export default Home

