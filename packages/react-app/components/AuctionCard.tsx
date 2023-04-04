import { timestampToDate, endAuction } from '../utils'
import {ethers} from "ethers";
import { useAccount } from 'wagmi'

interface AuctionCardProps {
  id: number;
  owner: string;
  name: string;
  highestBid: number;
  endTime: number;
  ended: boolean;
  bidHandler: (id: number) => void;
}



const AuctionCard: React.FC<AuctionCardProps> = ({
     id,
     owner,
     name,
     highestBid,
     endTime,
     ended,
     bidHandler
   }) => {

  const { address } = useAccount()

  const endAuctionHandler = async index => {

    const res = await endAuction(index)

  }

  return (
      <div className="bg-white rounded-lg shadow-lg p-4">
        <h2 className="mb-2">{name}</h2>
        <div className="flex justify-between">
          <div className="mr-4">
            <p>Current Bid</p>
            <span>{ethers.utils.formatEther(highestBid)}</span>
          </div>
          <div>
            <p>Auction End</p>
            <span>{timestampToDate(endTime.toNumber())}</span>
          </div>
        </div>
        <div>
          {!ended && (owner !== address) && <button onClick={() => bidHandler(id)} className="mt-3 bg-slate-300 w-28 rounded">
            Bid
          </button>}
          {!ended && (owner === address) && <button onClick={() => endAuctionHandler(id)} className="mt-3 bg-slate-300 w-28 rounded">
            End Auction
          </button>}
        </div>
      </div>
  );
};

export default AuctionCard;
