import React from 'react'

interface IFormInput {
  placeholder: string;
  value: string;
  type: string;
  onChange: (e: React.FormEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export default function FormInput(params: IFormInput) : JSX.Element {
  return (
      <input
      type={params.type}
        className="
          form-control
          block
          w-full
          px-3
          py-1.5
          text-base
          font-normal
          text-gray-700
          bg-white bg-clip-padding
          border border-solid border-gray-300
          rounded
          transition
          ease-in-out
          mx-0
          my-2
          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
        "
        disabled= {params.disabled}
        id="exampleFormControlInput1"
      placeholder={params.placeholder}
      value={params.value}
      onChange={params.onChange}
      />    
  )
}
