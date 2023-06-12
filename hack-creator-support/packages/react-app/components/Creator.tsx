import React, { useState, useRef } from 'react'
import CustomButton from './CustomButton'
import CircleCheck from '../images/circle-check.svg'
import SupporterModal from './Modal/SupporterModal'
import { useAccount } from 'wagmi'
import { BigNumber } from 'ethers'
import { useQuery } from '@tanstack/react-query'
import { getCreators } from '../utils/CeloInteract'
// import BootStrapSupporter from './Modal/BootStrapSupporter'
import CustomModal from './Modal/SupporterModal'
import { truncate } from '../utils/truncate'

interface ICreator {
  id: number;
  image: string,
  name: string,
  bio: string,
  earnings: number,
  supporters: number
  currency: string
  creatorAddress: string
}

export default function Creator(params: ICreator): JSX.Element{
    const { address } = useAccount()
  const [index, setIndex] = useState<number>(0)
  const [show, setShow] = useState<boolean>(false)
  let creatorIndex = useRef<number>();

  const { data } = useQuery({
    queryKey: ['creator'],
    queryFn: async () => {
      const creators = await getCreators(kit)
      creators.forEach((item) => {
       setIndex(creatorIndex.current = item.id)
      })
      return creatorIndex;
    }
  })
  console.log(data)

  const handleOpenModal = () => {
   if (address) {
      setShow(true)
    } else {
      setShow(false)
    }
  }

  const handleClose = () => {
    setShow(false)
  }
  return (
   <div className="flex justify-center m-4 w-full">
    <div className="flex flex-col md:flex-row md:max-w-xl rounded-lg bg-white shadow-lg">
      <img className=" w-full lg:h-auto md:h-auto object-cover md:w-48 rounded-t-lg md:rounded-none md:rounded-l-lg" src={params.image} alt="profile pix" />
      <div className="p-6 flex flex-col justify-start">
        <h5 className="text-gray-900 text-xl font-medium mb-2">{params.name}</h5>
        <p className="text-gray-700 text-base mb-4">
          {params.bio}
        </p>
          <div className='flex'>
            <img src={CircleCheck} alt="icon" width={24} />
            <div>
              <p className="text-gray-600 text-xs">Donation received</p>
              <p className="text-gray-600 ml-2 text-lg">{ params.earnings}<span> {params.currency}</span></p>
            </div>  
          </div>

           <div className='flex'>
            <img src={CircleCheck} alt="icon" width={24} />
            <div>
              <p className="text-gray-600 text-xs ml-2">Supporter(s)</p>
              <p className="text-gray-600 ml-2 text-lg">{params.supporters}</p>
            </div>  
          </div>        
          <CustomButton
            myStyle='bg-amber-500 mt-4 w-full'
            text={`${truncate(params.creatorAddress)} Support`}
            toggleValue='modal'
            targetValue={address === undefined ? "#exampleModalCenter" : '#supporterModal2'} action={handleOpenModal} />
          {/* <SupporterModal myId={params.id} username={params.name} walletAddress ={params.creatorAddress} /> */}
          <SupporterModal myId={params.id} username={params.name} walletAddress={params.creatorAddress} show={show} onHide={() =>handleClose()} />
      </div>
  </div>
</div>
  )
}
