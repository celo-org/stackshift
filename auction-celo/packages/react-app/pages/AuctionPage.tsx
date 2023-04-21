import React, { useState } from "react";

import ProductCard from "@/components/ProductCard";
import { products } from "../utils/data";
import { Bid } from "../../../AuctionUtils";

export default function Auction() {
  const [bid, setBid] = useState(false);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleBid = async (amount: string, address: string) => {
    try {
      console.log("got here");
      try {
        await Bid(amount, address);
        alert("Bid successful");
        console.log("here again");
      } catch (error) {
        console.error(error);
      }
      // Update the UI to show the donation was successful
      setBid(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex flex-wrap -mx-4">
        {products.map((auction, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <ProductCard {...auction} onBid={handleBid} bid={bid} />
          </div>
        ))}
      </div>
    </div>
  );
}
