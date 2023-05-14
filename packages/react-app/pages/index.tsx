import { useState, useEffect } from 'react'
import ToucanClient from 'toucan-sdk'
import Image from 'next/image'
import { getProducts, getNFT, buyProduct, formatPrice, addressToLowerCase } from '../utils'
import { useProvider, useSigner, useAccount } from 'wagmi'
import CarbonOffsets from '../components/CarbonOffset'
import {parseEther} from "ethers/lib/utils";

export default function Home(): JSX.Element {

  const { address } = useAccount()
  const [tco2Address, setTco2Address] = useState('')
  const [products, setProducts] = useState(undefined)
  const [NFT, setNFT] = useState(undefined)

  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const toucan = new ToucanClient('alfajores', provider)
  console.log(toucan)
  signer && toucan.setSigner(signer)

  const redeemPoolToken = async (): Promise<void> => {
    try {
      const redeemedTokenAddress = await toucan.redeemAuto2('NCT', parseEther('1'))
      return redeemedTokenAddress[0].address
    } catch (e) {
      console.log(e)
    }
  }


  const retireTco2Token = async (): Promise<void> => {
    try {
      const tco2Address = await redeemPoolToken()
      return await toucan.retire(parseEther('1'), tco2Address)
    } catch (e) {
      console.log(e)
    }
  }

  const getUserRetirements = async() => {
    return await toucan.fetchUserRetirements(addressToLowerCase(address))
  }

  const supportAndBuy = async(index, price) => {
    const res = await retireTco2Token()
    res && (await buyProductHandler(index, price))
  }


  const buyProductHandler = async (index, price) => {

    if (!address) return alert('Connect your Celo wallet')

    const retirements = await getUserRetirements()

    if (retirements) {
      await buyProduct(index, price, retirements.length)
      await getNftHandler()
    }
  }

  const getProductsHandler = async () => {
    setProducts(await getProducts())
  }

  const getNftHandler = async () => {
    setNFT(await getNFT())
  }

  useEffect(() => {

    getProductsHandler()
    getNftHandler()

  }, [getProducts, getNFT])

  return (
    <div>

      <div>
        {!NFT ? <div className="text-center">
          <h1 className="font-bold text-gray-900">Nothing yet</h1>
          <p className="text-sm font-medium text-gray-900">Purchase Product to receive NFT</p>
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
        <div className="grid grid-cols-3 gap-4 mt-10">
          {products && products.map((product, i) => (
            <div key={i}>

              <div className="bg-white rounded-lg shadow-lg p-4">
                <Image
                  src={require(`../assets/img/${product.imagePath}`)}
                  width="200px"
                  alt="Product image"
                />
                <h2 className="font-bold mb-2">{product.name}</h2>
                <p>{formatPrice(product.price)} CELO</p>
                <button onClick={() => buyProductHandler(i, product.price)} type="button"
                        className="mt-3 bg-slate-300 w-28 rounded">
                  Buy
                </button>
                <button onClick={() => supportAndBuy(i, product.price)} type="button"
                        className="mt-3 bg-slate-300 w-28 rounded">
                  Support & Buy
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      {/*<CarbonOffsets />*/}
    </div>
  )
}

// QmUPHAUomY9XsddpVey8NEmNVLrXhViW8onXemCuvFP99L
// GreenProduct