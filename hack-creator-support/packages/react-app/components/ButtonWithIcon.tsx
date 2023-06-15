import React from 'react'

interface IButtonWithIcon {
  myStyle: string;
  text: string;
  image?: string;
  action?: () => void;
}

export default function ButtonWithIcon(params: IButtonWithIcon) : JSX.Element{
  return (
      <div className='w-full mx-4'>
      <button className={`${params.myStyle} 
        px-8 pt-2.5 pb-2 
        font-medium text-xs 
        leading-normal 
        rounded shadow-md 
        hover:shadow-lg 
        focus:bg-blue-200 
        focus:shadow-lg 
        focus:outline-none
        focus:ring-0 
        active:shadow-lg 
        transition 
        duration-150 
        ease-in-out flex 
        align-center 
        w-full  transition
      duration-150
      ease-in-out `} data-bs-dismiss="modal" onClick={params.action} type="button" >
         <img src={params.image} alt="wallet-icon" width={36} />
          {params.text}
        </button>
      </div>
  )
}
