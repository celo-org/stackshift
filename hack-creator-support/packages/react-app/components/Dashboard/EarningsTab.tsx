import React from 'react'
 interface IParams {
    donationsReceived: number;
    supporters: number;
 }
  
export default function EarningsTab(param: IParams): JSX.Element{
  return (
    <div className='flex'>
      <div className='bg-gray-500 p-8 rounded-lg'>
        <h1 className='font-bold'>{`${ param.donationsReceived } MATIC `}</h1>
        <p>All time</p>
      </div>
      <div className='bg-gray-500 p-8 rounded-lg ml-8'>
        <h1 className='font-bold'>{ param.supporters }</h1>
        <p>Supporters</p>
      </div>
    </div>
  )
}
