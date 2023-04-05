import { title } from "process";
import React, { useState } from "react";

type AuctionProps = {
  image: string;
  name: string;
  title: string;
  description: string;
  address: string;
  onBid: (amount: string, address: string) => void;
  bid: boolean;
  rating: boolean;
  category: string;
  id: string;
  price: string;
};

const ProductCard = ({
  image,
  name,
  description,
  address,
  onBid,
  title,
  price,
}: AuctionProps) => {
  const [AuctionAmount, setAuctionAmount] = useState("");
  const [AuctionAddress, setAuctionAddress] = useState("");

  const handleBidSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onBid(AuctionAmount, AuctionAddress);
    setAuctionAmount("");
    setAuctionAddress("");
  };

  return (
    <div className="card">
      <img src={image} alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <h5 className="card-title underline decoration-1">{title}</h5>
        <p className="card-text mt-4">{description}</p>
        <form onSubmit={handleBidSubmit}>
          <h5 className="card-title text-slate-400 hover:text-sky-400">
            Auction Price: cUSD {price}
          </h5>
          <div className="form-group mt-4">
            <label htmlFor="donationAmount">Enter Bidder's Address: </label>
            <input
              type="text"
              className="form-control"
              id="AuctionAddress"
              value={AuctionAddress}
              onChange={(event) => setAuctionAddress(event.target.value)}
            />
            <label htmlFor="donationAmount" className="mt-4">
              Enter Bid amount:{" "}
            </label>
            <input
              type="text"
              className="form-control"
              id="donationAmount"
              value={AuctionAmount}
              onChange={(event) => setAuctionAmount(event.target.value)}
            />
          </div>
          <button className="bg-blue-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-600">
            Bid
          </button>
        </form>
      </div>
    </div>
  );
};

export default ProductCard;
