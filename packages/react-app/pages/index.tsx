
import NftAuction from "@/components/NftAuction";

import NFTABI from '../abi/AuctionNFT.json'

export default function Home() {
  return (
    <div>
      <NftAuction nftContractAddress="0xe865ff5D675F1dCaccD945f0b97Cb9D506596c90" auctionContractAddress="0xb930528BD616782C833C83C305A48b1269c88970" erc721Abi={NFTABI} />
    </div>
  )
}
