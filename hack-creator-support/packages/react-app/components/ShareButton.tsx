import React from 'react'
 import {
  FacebookShareButton,
  FacebookIcon,
  TwitterShareButton,
  TwitterIcon,
} from "react-share";

interface IParams{
  username: string;
}
export default function ShareButton(param: IParams) {
  return (
    <div className="flex justify-center">
  <div>
        <h1 className='my-2'>Share your profile on:</h1>
          <div className='flex dropdown-item'>
                <TwitterShareButton url={`https://www.dsupport.vercel.app/${param.username}`} title="I’m on @dsupportDapp. If you like my work, you can send me some tip and share your thoughts 🎉☕">
                    <TwitterIcon size={40} round={true} />
                </TwitterShareButton>
                <p className='text-white'>Twitter</p>
          </div>

         <div className='flex dropdown-item mt-2'>
            <FacebookShareButton url={`https://www.dsupport.vercel.app/${param.username}`}title="I’m on @dsupportDapp. If you like my work, you can send me some tip and share your thoughts 🎉☕" hashtag=''>
                <FacebookIcon size={40} round={true} />
            </FacebookShareButton>
            <p className='text-white justify-center items-center ml-2'>Facebook</p>
          </div>
  </div>
</div>
  )
}
