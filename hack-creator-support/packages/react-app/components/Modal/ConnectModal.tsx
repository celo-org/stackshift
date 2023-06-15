import React, { useState } from 'react';
import { ConnectButton } from "@rainbow-me/rainbowkit";
 import { LoginWithMasa } from "@/SocialConnect/MasaIntegration";

interface IParam {
  show: boolean
  onHide: () => void
}

export default function ConnectModal({ show, onHide }: IParam) {

  const connectWithMasa = async () => {
    await LoginWithMasa()
    onHide()
    window.location.reload()
  }
  return (
    <div>
      
      {show && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-900 bg-opacity-90 w-full h-full outline-none" id='connectModal'>
          <div className="bg-white rounded-md p-6 relative lg:w-1/3 md:w-full sm:w-full my-6 mx-auto">
            <div className="flex justify-between items-center pb-4 border-b border-solid border-gray-300 py-4">
              <h5 className="text-xl font-medium text-gray-800 ">Connect Wallet</h5>
              <button
                type="button"
                className="text-gray-500 hover:text-gray-700 focus:outline-none"
                onClick={onHide}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="h-6 w-6"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              </button>
            </div>
            <div className='flex flex-col w-full'>    
              <div className='bg-blue-500 p-2 rounded-lg w-full' >
                <ConnectButton showBalance={{  smallScreen: true, largeScreen: false }} />
              </div>  
              <button
                onClick={connectWithMasa}
                type="button"
                className="ml-1 mt-2 p-2 items-left rounded-lg inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-lg font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Connect with Masa
                </button>
            </div>
              </div>
            </div>
        )}
      </div>
  )
}
