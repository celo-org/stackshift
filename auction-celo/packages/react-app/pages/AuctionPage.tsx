import React, { useState } from "react";

import ProductCard from "@/components/ProductCard";
import { products } from "../utils/data";

export default function Auction() {
  const [donated, setDonated] = useState(false);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex flex-wrap -mx-4">
        {products.map((auction, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <ProductCard
              {...auction}
              //   onDonate={handleDonate}
              donated={donated}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
