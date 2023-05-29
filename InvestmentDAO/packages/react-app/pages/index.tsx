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

      <div className="inline-flex items-center justify-center pl-12 pr-12 py-20 w-full bg-[#110C1F]">
        <div className="inline-flex flex-col space-y-20 items-start justify-center pl-14 pr-14 pt-12 pb-44 bg-[#220538] rounded-2xl">
          <p className="text-3xl font-bold leading-10 text-purple-200">Why  Invest With Us?</p>
          <div className="relative" style={{width: 1034.19, height: 468}}>
            <div className="inline-flex space-x-4 items-start justify-start absolute left-0 top-0" style={{width: 465.22, height: 133.68,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="flex items-start justify-start h-36">
                <div className="inline-flex flex-col space-y-4 items-start justify-start">
                  <p className="text-2xl font-bold leading-loose text-purple-200">Decentralized Decision-making </p>
                  <div className="h-16">
                    <p className="w-full text-base leading-normal text-purple-200">As a DAO, our investment decisions are made collectively by our community members. <br/></p>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex space-x-7 items-start justify-start absolute right-0 top-0" style={{width: 472.56, height: 133.68,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="flex items-start justify-start h-32">
                <div className="inline-flex flex-col space-y-4 items-start justify-start">
                  <p className="text-2xl font-bold text-purple-200">Diversified Portfolio</p>
                  <div className="flex flex-col items-start justify-start h-36">
                    <p className="w-full text-base text-purple-200">Our expert team of analysts and researchers continuously evaluate and select a diverse range of investment opportunities.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex space-x-4 items-center justify-start absolute" style={{width: 515, height: 129, left: 0, top: 158,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="flex items-start justify-start h-full">
                <div className="inline-flex flex-col space-y-4 items-start justify-start h-28">
                  <p className="text-xl font-bold text-purple-200">Accessible to All</p>
                  <div className="flex flex-col items-start justify-start h-36">
                    <p className="w-full text-base text-purple-200">We believe that everyone should have the opportunity to participate in the digital asset revolution. </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex space-x-4 items-center justify-start absolute left-0 bottom-0" style={{width: 465.22, height: 133.68,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="flex items-start justify-start h-32">
                <div className="inline-flex flex-col space-y-4 items-start justify-start h-28">
                  <p className="text-2xl font-bold text-purple-200">Community Engagement</p>
                  <div className="flex flex-col items-start justify-start h-20">
                    <p className="w-full text-base text-purple-200">We foster collaboration, knowledge sharing, and networking among our members. Through regular updates, educational resources.</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="inline-flex space-x-7 items-center justify-start absolute inset-y-0 right-0 my-auto" style={{width: 472.56, height: 133.68,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="inline-flex flex-col space-y-4 items-start justify-start h-full">
                <p className="text-2xl font-bold text-purple-200">Security and Transparency</p>
                <div className="flex flex-col items-start justify-start h-20">
                  <p className="w-full text-base text-purple-200">We prioritize the security of our investors' funds. Our investment strategies adhere to strict security protocols.</p>
                </div>
              </div>
            </div>
            <div className="inline-flex space-x-7 items-end justify-start absolute right-0 bottom-0" style={{width: 474.19, height: 138.45,}}>
              <div className="inline-flex flex-col items-start justify-start w-24 h-24 p-2.5 bg-indigo-600 rounded-lg">
                <img className="w-20 h-20" src="#"/>
              </div>
              <div className="flex items-start justify-start h-32">
                <div className="inline-flex flex-col space-y-4 items-start justify-start h-32">
                  <p className="text-2xl font-bold leading-normal text-purple-200">Simplified Investment Process</p>
                  <div className="flex flex-col items-start justify-start h-2/3 pb-14">
                    <p className="w-full text-base font-medium leading-normal text-purple-200">Our user-friendly platform streamlines the investment process, making it accessible to both experienced and novice investors.<br/></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="inline-flex items-start gap-4 justify-end px-12 py-20 bg-[#110C1F]">
        <div className="inline-flex space-x-6 items-center justify-start ">
          <div className="inline-flex flex-col space-y-6 items-start justify-center">
            <div className="flex flex-col space-y-6 items-start justify-start">
              <p className="text-3xl font-bold leading-normal text-purple-200">How to Get Started</p>
              <p className="w-15 h-24 text-base font-medium leading-normal text-purple-200">We're thrilled to have you on board. This guide will walk you through the essential steps to get started and make the most out of our platform.<br/></p>
            </div>
            <div className="inline-flex space-x-2 items-center justify-center px-8 py-4 bg-gradient-to-b from-purple-600 to-indigo-700 rounded-lg">
              <a href='#' className="text-base font-medium leading-normal text-white">Launch App</a>
            </div>
          </div>
        </div>
        <div>
          <div className="relative" style={{width: 818, height: 296,}}>
            <div className="inline-flex items-center justify-center w-52 h-28 p-8 absolute bg-purple-900 rounded-lg" style={{left: 25, top: 30,}}>
              <p className="w-40 text-base font-medium leading-normal text-purple-200">Launch the app and Connect wallet</p>
            </div>
            <div className="inline-flex items-center justify-center w-52 h-28 p-8 absolute bg-purple-900 rounded-lg" style={{left: 25, top: 187,}}>
              <p className="w-44 text-base font-medium leading-normal text-center text-purple-200">Investment in off-chain and on-chain assets</p>
            </div>
            <div className="inline-flex items-center justify-center w-52 h-28 p-8 absolute bg-purple-900 rounded-lg" style={{left: 316, top: 184,}}>
              <p className="w-40 text-base font-medium leading-normal text-purple-200">Track and Manage Your Investments</p>
            </div>
            <div className="inline-flex items-start justify-start w-52 h-28 p-8 absolute right-0 bottom-0 bg-purple-900 rounded-lg">
              <p className="w-40 text-base font-medium leading-normal text-purple-200">Engage with the Community</p>
            </div>
            <div className="inline-flex items-center justify-center w-52 h-28 p-8 absolute bg-purple-900 rounded-lg" style={{left: 316, top: 30,}}>
              <p className="w-44 text-base font-medium leading-normal text-purple-200">Explore Available Investments</p>
            </div>
            <div className="inline-flex items-center justify-center w-52 h-28 p-8 absolute bg-purple-900 rounded-lg" style={{left: 607, top: 30,}}>
              <p className="w-40 text-base font-medium leading-normal text-purple-200">conduct thorough due diligence.</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute left-0 top-0 bg-indigo-600 rounded-lg">
              <p className="text-3xl font-medium leading-normal text-purple-200">1</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute bg-indigo-600 rounded-lg" style={{left: 0, top: 157,}}>
              <p className="text-3xl font-medium leading-normal text-purple-200">4</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute bg-indigo-600 rounded-lg" style={{left: 291, top: 154,}}>
              <p className="text-3xl font-medium leading-normal text-purple-200">5</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute bg-indigo-600 rounded-lg" style={{left: 582, top: 151,}}>
              <p className="text-3xl font-medium leading-normal text-purple-200">6</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute bg-indigo-600 rounded-lg" style={{left: 291, top: 0,}}>
              <p className="text-3xl font-medium leading-normal text-purple-200">2</p>
            </div>
            <div className="inline-flex flex-col items-start justify-start w-16 h-14 px-8 py-4 absolute bg-indigo-600 rounded-lg" style={{left: 583, top: 0,}}>
              <p className="text-3xl font-medium leading-normal text-purple-200">3</p>
            </div>
          </div>
        </div>
      </div>
      {/* Team */}
      <div className="w-full flex flex-col items-center gap-4 justify-center px-12 py-20 bg-[#110C1F]">
        <p className=" text-3xl font-bold leading-10 text-purple-200">Our Team</p>
        <div className="flex flex-row gap-4">

          <div className="flex flex-col space-y-0.5 items-center justify-center w-72 h-80 px-12 py-2 bg-[#301877] rounded-lg">
            <img className="w-52 h-52" src=""/>
            <p className="text-base font-bold leading-normal text-white">Glory Agatevure</p>
            <p className="text-base italic font-italic leading-normal text-white">Co-founder</p>
            <div className="inline-flex space-x-1.5 items-start justify-start">
              <img className="w-6 h-full rounded-lg" src=""/>
              <img className="w-6 h-full rounded-lg" src=""/>
            </div>
          </div>

          <div className="flex flex-col space-y-0.5 items-center justify-center w-72 h-80 px-12 py-2 bg-[#301877] rounded-lg">
            <img className="w-52 h-52" src=""/>
            <p className="text-base font-bold leading-normal text-white">Justin Obi</p>
            <p className="text-base italic font-italic leading-normal text-white">Co-founder</p>
            <div className="inline-flex space-x-1.5 items-start justify-start">
              <img className="w-6 h-full rounded-lg" src=""/>
              <img className="w-6 h-full rounded-lg" src=""/>
            </div>
          </div>

          <div className="flex flex-col space-y-0.5 items-center justify-center w-72 h-80 px-12 py-2 bg-[#301877] rounded-lg">
            <img className="w-52 h-52" src=""/>
            <p className="text-base font-bold leading-normal text-white">Joshua Moses</p>
            <p className="text-base italic font-italic leading-normal text-white">Co-founder</p>
            <div className="inline-flex space-x-1.5 items-start justify-start">
              <img className="w-6 h-full rounded-lg" src=""/>
              <img className="w-6 h-full rounded-lg" src=""/>
            </div>
          </div>
        </div>
      </div>

    </>
  )
}

export default Home

