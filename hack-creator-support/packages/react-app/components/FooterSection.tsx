import React from 'react'
import { SocialMedia } from './Socials'

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
          {SocialMedia.map((item) => <a href={item.link}>
            <img className='ml-2' src={require(`../images/socials/${item.icon}`)} width={36}  alt="social-icon" />
          </a> 
          )}
        </div>
      </div>
    </div>
  )
}
