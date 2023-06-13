import React from 'react'
import { SocialMedia } from './Socials'
import Image from 'next/image'
import Link from 'next/link'

export default function Footer() : JSX.Element{
  return (
    <div className='flex p-12 bg-amber-500'>
      <div>
        <h2 className='font-bold'>DSupport</h2>
        <p>Send in your support today to support the works of the creators</p>
      </div>
      <div className='ml-24'>
        <h2 className='font-bold ml-2'>Connct Via Social Media</h2>
        <div className='flex'>
          {SocialMedia.map((item) => <Link key={item.icon} href={item.link}>
            <Image  className='ml-2' src={require(`../images/socials/${item.icon}`)} width={36} height={36} alt="social-icon" />
          </Link> 
          )}
        </div>
      </div>
    </div>
  )
}
