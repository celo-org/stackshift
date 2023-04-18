export interface AuctionTypes {
  id: number;
  description: string;
  endTime: number;
  startTime: number;
  highestBid: number;
  highestBidder: `0x${string}`;
  preview: `ipfs://${string}`;
  reservePrice: number;
  seller: `0x${string}`;
  title: string;
  ended: boolean;
  itemReceived: boolean;
}

export interface ContractResponseType {
  id: number;
  ipfsHash: `ipfs://${string}`;
  seller: `0x${string}`;
  startTime: number;
  endTime: number;
  highestBidder: `0x${string}`;
  highestBid: number;
  reservePrice: number;
  ended: boolean;
  itemReceived: boolean;
}
