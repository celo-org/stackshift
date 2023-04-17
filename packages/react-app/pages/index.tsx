import {useEffect, useState} from "react";
import { getAuctions, bidAuction } from '../utils'
import AuctionCard from '../components/AuctionCard'
import AuctionForm from '../components/AuctionForm'

type DoSomethingFunction = () => void;

interface HomeProps {
  updateList: DoSomethingFunction;
}


export default function Home(props: HomeProps) : JSX.Element{

  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [auctions, setAuctions] = useState(undefined)
  const [selectedItemId, setSelectedItemId] = useState('')
  const [selectedItemValue, setSelectedItemValue] = useState('')

  const getAuctionHandler = async () => {
    const res = await getAuctions()
    setAuctions(res)
  }

  const bidHandler = (id) => {
    setShowForm(true)
    setSelectedItemId(id)
  }

  const sendBid = async () => {
    setLoading(true)
    await bidAuction(selectedItemId, selectedItemValue)
    await getAuctionHandler()
    setLoading(false)
  }

  useEffect(() => {

    getAuctionHandler()

  }, [getAuctions])

  return (
    <div className="item-list">

      <AuctionForm updateList={getAuctionHandler}/>

        <div className="grid grid-cols-3 gap-4 mt-10">
          {auctions && auctions.map((item, i) => (
            <AuctionCard
              key={i}
              id={i}
              owner={item.owner}
              name={item.name}
              highestBid={item.highestBid}
              endTime={item.endTime}
              ended={item.ended}
              bidHandler={bidHandler}
            />
          ))}
      </div>

      {showForm && <div className="flex mt-3">
        <div className="">
          <label htmlFor="value" className="sr-only">End Time</label>
          <input onChange={e => setSelectedItemValue(e.target.value)} name="value" type="number" placeholder="Value"
                 className="w-20 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"/>
        </div>
        <button onClick={sendBid} type="button"
                className="ml-2 inline-flex items-center px-4 bg-blue-500 border border-transparent rounded-md font-semibold text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2">
          {loading ? 'Sending ...' : 'Send'}
        </button>
      </div>}

    </div>
  )
}

