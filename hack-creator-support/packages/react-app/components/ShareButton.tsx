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
    <div className="dropdown relative">
      <button
        className="
          dropdown-toggle
          px-6
          py-2.5
          bg-blue-600
          text-white
          font-medium
          text-xs
          leading-tight
          uppercase
          rounded
          shadow-md
          hover:bg-blue-700 hover:shadow-lg
          focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0
          active:bg-blue-800 active:shadow-lg active:text-white
          transition
          duration-150
          ease-in-out
          flex
          items-center
          whitespace-nowrap
        "
        type="button"
        id="dropdownMenuButton1"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        Share Page
        <svg
          aria-hidden="true"
          focusable="false"
          data-prefix="fas"
          data-icon="caret-down"
          className="w-2 ml-2"
          role="img"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 320 512"
        >
          <path
            fill="currentColor"
            d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
          ></path>
        </svg>
      </button>
      <ul
        className="
          dropdown-menu
          min-w-max
          absolute
          hidden
          bg-white
          text-base
          z-50
          float-left
          py-2
          list-none
          text-left
          rounded-lg
          shadow-lg
          mt-1
          hidden
          m-0
          bg-clip-padding
          border-none
        "
        aria-labelledby="dropdownMenuButton1"
          > 
            <div className='w-full'>
              <div className='flex dropdown-item'>
                <FacebookShareButton url={`https://www.dsupport.vercel.app/${param.username}`}title="I’m on @dsupportDapp. If you like my work, you can send me some tip and share your thoughts 🎉☕" hashtag=''>
                    <FacebookIcon size={40} round={true} />
                </FacebookShareButton>
                <p className='text-black'>Facebook</p>
              </div>

                <div className='flex dropdown-item'>
                <TwitterShareButton url={`https://www.dsupport.vercel.app/${param.username}`} title="I’m on @dsupportDapp. If you like my work, you can send me some tip and share your thoughts 🎉☕">
                    <TwitterIcon size={40} round={true} />
                </TwitterShareButton>
                <p className='text-black'>Twitter</p>
              </div>
            </div>
      </ul>
    </div>
  </div>
</div>
  )
}
