import { useState, useEffect } from 'react'
import Image from 'next/image'
import { getProducts, getNFT } from '../utils'
import CarbonOffsets from '../components/CarbonOffset'

export default function Home(): JSX.Element {

  const [NFT, setNFT] = useState(undefined)

  const getNftHandler = async () => {
    setNFT(await getNFT())
  }

  useEffect(() => {

    getNftHandler()

  }, [getProducts, getNFT])

  return (
    <div>

      <div>
        {!NFT ? <div className="text-center">
          <h1 className="font-bold text-gray-900">Nothing yet</h1>
          <p className="text-sm font-medium text-gray-900">Support any Green initiative to receive NFT</p>
          </div> : <div className="text-center">
          <Image
            src={NFT.image}
            width={300}
            height={300}
            alt="NFT image"
            className="mx-auto"
          />

            <p className="font-bold">{NFT.name}</p>
            <p>{NFT.description}</p>
          </div>
        }

      </div>
      <CarbonOffsets getNFTHandler={getNftHandler()} />
    </div>
  )
}