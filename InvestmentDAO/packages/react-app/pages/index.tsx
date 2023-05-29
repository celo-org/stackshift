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

      <div className='bg-[#110C1F] flex flex-row px-12 py-12 row'>
        <div className='container row'>
          <div className='grid grid-cols-2 gap-6'>
            <div className='bg-[#301877] rounded-lg'>
              {/* hero image */}
              <img className='rounded' src='../assets/about-img.svg'></img>
            </div>

            <div className='flex flex-col space-y-5 items-start justify-center'>
              <h3 className="text-3xl font-bold leading-10 text-[#EBD8FF]">About us</h3>
              <p className='text-base font-medium leading-normal text-[#EBD8FF]'>DAOAnalyzer Investment DAO is a revolutionary decentralized autonomous organization (DAO) dedicated to democratizing access to investment opportunities in the digital asset space.</p>
              <p className='text-base font-medium leading-normal text-[#EBD8FF]'>Our mission is to empower individuals from all backgrounds to participate in the growth of cryptocurrencies, blockchain projects, and other emerging digital assets.</p>
              <div className="inline-flex space-x-2 items-center justify-center px-8 py-4 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-lg">
                <a href='' className="text-base font-medium leading-normal text-white">Learn More</a>
              </div>
              <div className='inline-flex space-x-6 items-start justify-start'>
                <div className="inline-flex flex-col items-start justify-start">
                  <p className="text-4xl font-bold leading-10 text-white">500</p>
                  <p className="w-full text-base font-medium leading-normal text-white">Members</p>
                </div>
                <div className="inline-flex flex-col items-start justify-start">
                  <p className="text-4xl font-bold leading-10 text-white">1000</p>
                  <p className="w-20 text-base font-medium leading-normal text-white">Proposals</p>
                </div>
                <div className="inline-flex flex-col items-start justify-start">
                  <p className="text-4xl font-bold leading-10 text-white">50</p>
                  <p className="w-full text-base font-medium leading-normal text-white">Investments</p>
                </div>
              </div>
            </div>
          </div>

        </div>



      </div>
    </>
  )
}

export default Home

