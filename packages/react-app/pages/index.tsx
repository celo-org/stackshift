import { useEffect, useState } from 'react'
import Image from 'next/image'
import { getProducts, getNFT, buyProduct, formatPrice } from '../utils'
import { useAccount } from 'wagmi'

export default function Home () {

  const { address } = useAccount()

  const [products, setProducts] = useState(undefined)
  const [NFT, setNFT] = useState(undefined)

  const buyProductHandler = async (index, price) => {

    if (!address) return alert('Connect your Celo wallet')

    const res = await buyProduct(index, price)
    await getNftHandler()
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
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}