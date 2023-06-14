import React from 'react'
import MASALOGO from '../images/partners/logo-darkmode.svg'
import SocialConnect from '../images/partners/socialconnect1.png'
import CELOLOGO from '../images/partners/logo-dark.png'
import Image from 'next/image'
import Link from 'next/link'

export default function PartnerSection() {
  return (
    <div className='mt-24'>
      <h3 className='text-center text-3xl p-4'>🙌  Partner Integrations 🙌 </h3>
      <div className='grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 p-8 mb-24 justify-center'>
        <Link href="https://celo.org/">
          <Image src={CELOLOGO} width={200} alt="celo" />
        </Link>
        <Link href="https://www.masa.finance/">
          <Image className='ml-8 mt-4' src={MASALOGO} width={200}  alt="masa" />
        </Link>
        <Link href="https://github.com/celo-org/SocialConnect">
          <Image className='ml-8 mt-4' src={SocialConnect} width={300}  alt="socialconnect" />
        </Link>

      </div>
    </div>
  )
}
