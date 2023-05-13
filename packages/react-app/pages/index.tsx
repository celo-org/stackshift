import { useState, useEffect } from 'react'
import ToucanClient from 'toucan-sdk'
import Image from 'next/image'
import { getProducts, getNFT, buyProduct, formatPrice } from '../utils'
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
    const redeemedTokenAddress = await toucan.redeemAuto2('NCT', parseEther('1'))
    console.log(redeemedTokenAddress)
    // 0xB297F730E741a822a426c737eCD0F7877A9a2c22
    redeemedTokenAddress && setTco2Address(redeemedTokenAddress[0].address)
  }


  const retireTco2Token = async (): Promise<void> => {
    // const redeemedTokenAddress = await toucan.retire(parseEther('1'), '0xB297F730E741a822a426c737eCD0F7877A9a2c22')
    const redeemedTokenAddress = await toucan.fetchUserRedeems('')
    // const redeemedTokenAddress = await toucan
    console.log(redeemedTokenAddress)
    // redeemedTokenAddress && setTco2Address(redeemedTokenAddress[0].address)
  }

  const getUserRetirements = async() => {
    let currentAddress = address?.toLocaleLowerCase() as string
//     const res = await toucan.fetchUserRedeems(currentAddress, 'NCT')
// console.log('res')
// return console.log(res)
    const userRetirements = await toucan.fetchUserRetirements(currentAddress)
    return console.log(userRetirements)
  }


  const buyProductHandler = async (index, price) => {
    const retirements = await getUserRetirements()


    // if (!address) return alert('Connect your Celo wallet')
    //
    // const res = await buyProduct(index, price)
    // await getNftHandler()
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
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={redeemPoolToken}>Redeem</button>
      <button onClick={retireTco2Token}>Retire</button>
      <CarbonOffsets />
    </div>
  )
}





//
// export default function Home () {
//
//
//   const [products, setProducts] = useState(undefined)
//   const [NFT, setNFT] = useState(undefined)
//
//   const buyProductHandler = async (index, price) => {
//
//     if (!address) return alert('Connect your Celo wallet')
//
//     const res = await buyProduct(index, price)
//     await getNftHandler()
//   }
//
//   const getProductsHandler = async () => {
//     setProducts(await getProducts())
//   }
//
//   const getNftHandler = async () => {
//     setNFT(await getNFT())
//   }
//
//   useEffect(() => {
//
//     getProductsHandler()
//     getNftHandler()
//
//   }, [getProducts, getNFT])
//
//   return (
//     <div>
//       {!NFT ? <div className="text-center">
//         <h1 className="font-bold text-gray-900">Nothing yet</h1>
//         <p className="text-sm font-medium text-gray-900">Purchase Product to receive NFT</p>
//       </div> : <div className="text-center">
//         <Image
//           src={NFT.image}
//           width={300}
//           height={300}
//           alt="NFT image"
//           className="mx-auto"
//         />
//
//         <p className="font-bold">{NFT.name}</p>
//         <p>{NFT.description}</p>
//       </div>
//       }
//       <div className="grid grid-cols-3 gap-4 mt-10">
//         {products && products.map((product, i) => (
//           <div key={i}>
//
//             <div className="bg-white rounded-lg shadow-lg p-4">
//               <Image
//                 src={require(`../assets/img/${product.imagePath}`)}
//                 width="200px"
//                 alt="Product image"
//               />
//               <h2 className="font-bold mb-2">{product.name}</h2>
//               <p>{formatPrice(product.price)} CELO</p>
//               <button onClick={() => buyProductHandler(i, product.price)} type="button"
//                       className="mt-3 bg-slate-300 w-28 rounded">
//                 Buy
//               </button>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   )
// }