import { useState } from 'react'
import {
  priceToWei,
  createNFT,
  imageToIPFS,
  JSONToIPFS
} from '../utils'
import {ethers} from "ethers";

export default function NFTForm() : JSX.Element {

  const [loading, setLoading] = useState(false)
  const [name, setName] = useState('')
  const [price, setPrice] = useState('')
  const [description, setDescription] = useState('default')
  const [image, setImage] = useState('')

  const createNFTHandler = async () => {

    // if (!address) return setNotification({message: 'Connect wallet to continue', success: false})
    //
    // if (isNotValid()) return setNotification({message: 'All fields are required', success: false})

    setLoading(true)

    // document.getElementById('nft-form').style.display = 'none'

    let CID = new Promise(async resolve => {
      const res = await imageToIPFS(image)
      resolve(res)
    })

    CID = await CID

    const nftJson = {
      name,
      price,
      description,
      image: CID
    }

    const NFTURI = await JSONToIPFS(nftJson)
// return console.log(NFTURI)
    const res = await createNFT(NFTURI, ethers.utils.parseUnits(price.toString(), 'ether'))
  console.log(res)
    setLoading(false)
    resetForm()
    // window.location.reload()
  }

  const resetForm = () => {
    setName('')
    setImage('')
    setPrice('')
    setDescription('')
  }

  return (

    <div>
      <h1 className="m-2  text-2xl">Justin NFT</h1>
      <form className="flex justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="name" className="sr-only">Name</label>
          <input onChange={e => setName(e.target.value)} type="text" name="item-name" id="name" placeholder="Name"
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="price" className="sr-only">Price</label>
          <input onChange={e => setPrice(priceToWei(e.target.value))} type="number" name="price" id="item-price" placeholder="Price"
                 className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="desc" className="sr-only">Description</label>
          <input onChange={e => setDescription(e.target.value)} type="text" name="item-name" id="desc" placeholder="Description,,."
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
            <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700">Upload file</label>
            <input onChange={e => setImage(e.target.files[0])}
                   className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                   type="file" id="formFile"/>

        </div>
        <button onClick={createNFTHandler} type="button"
                className="ml-2 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {loading ? 'Creating ...' : 'Create Auction'}
        </button>
      </form>
    </div>

)
}