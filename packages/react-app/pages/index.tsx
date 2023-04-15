import { useEffect, useState } from 'react'
import { getProducts, buyProduct, formatPrice } from '../utils'
import { useAccount } from 'wagmi'
import ethers from 'ethers'

export default function Home () {

  const { address } = useAccount()

  const [products, setProducts] = useState(undefined)

  const buyProductHandler = async (index, price) => {

    if (!address) return alert('Connect your Celo wallet')

    const res = buyProduct(index, price, address)
  }

  const getProductsHandler = async () => {
    setProducts(await getProducts())
  }

  useEffect(() => {

    getProductsHandler()

  }, [getProducts])

  return (
    <div>
      {products && products.map((product, i) => (
        <div key={i}>
          {product.name}
          {formatPrice(product.price)}
          <button onClick={() => buyProductHandler(i, product.price)} type="button">Buy</button>
        </div>
      ))}
    </div>
  )
}