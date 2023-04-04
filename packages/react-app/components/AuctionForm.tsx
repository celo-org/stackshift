import { useState } from 'react'
import { toTimestamp, createAuction, priceToWei } from '../utils'

// interface AuctionFormProps {
//   updateList: DoSomethingFunction;
// }

export default function AuctionForm(props: AuctionFormProps) : JSX.Element {
// export default function AuctionForm() : JSX.Element {

  const [loading, setLoading] = useState(false)
  const [domainName, setDomainName] = useState('')
  const [reservePrice, setReservePrice] = useState('')
  const [endTime, setEndTime] = useState('')

  const createAuctionHandler = async () => {
    setLoading(true)
    await createAuction(domainName, reservePrice, endTime)
    window.location.reload()
  }

  return (

    <div>
      <h1 className="m-2  text-2xl">Domain Name Auction</h1>
      <form className="flex justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="item-name" className="sr-only">Domain Name</label>
          <input onChange={e => setDomainName(e.target.value)} type="text" name="item-name" id="item-name" placeholder="Item Name"
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="item-price" className="sr-only">Reserve Price</label>
          <input onChange={e => setReservePrice(priceToWei(e.target.value))} type="number" name="item-price" id="item-price" placeholder="Item Price"
                 className="w-24 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="datetime" className="sr-only">End Time</label>
          <input onChange={e => setEndTime(toTimestamp(e.target.value))} type="datetime-local" name="datetime" id="datetime" placeholder="Datetime"
                 className="w-40 px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button onClick={createAuctionHandler} type="button"
                className="ml-2 inline-flex items-center px-4 py-2 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {loading ? 'Creating ...' : 'Create Auction'}
        </button>
      </form>
    </div>

)
}