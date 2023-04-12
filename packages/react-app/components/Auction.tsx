



import React, { useState } from "react";
import { donate } from "../SupportTokenWrapper";

type AuctionProps = {

  imageSrc: string;
  name: string;
  description: string;
  address: string;
  onDonate: (amount: string, address: string) => void;
  donated: boolean;
};

const AuctionCard = ({
  imageSrc,
  name,
  description,
  address,
  onDonate,
}: AuctionProps) => {
  const [donationAmount, setDonationAmount] = useState("");
  const [donationAddress, setDonationAddress] = useState("");
  const handleDonationSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onDonate(donationAmount, donationAddress);
    setDonationAmount("");
    setDonationAddress("");
  };

  return (
    <div className="card">
      <img src={imageSrc} alt={name} />
      <div className="card-body">
        <h5 className="card-title">{name}</h5>
        <p className="card-text mt-4">{description}</p>
        <form onSubmit={handleDonationSubmit}>
          <div className="form-group mt-4">
            <label htmlFor="donationAmount">Enter Auction Address: </label>
            <input
              type="text"
              className="form-control"
              id="donationAddress"
              value={donationAddress}
              onChange={(event) => setDonationAddress(event.target.value)}
            />
            <label htmlFor="donationAmount" className="mt-4">
              Enter bid amount:{" "}
            </label>
            <input
              type="text"
              className="form-control"
              id="bidAmount"
              value={donationAmount}
              onChange={(event) => setDonationAmount(event.target.value)}
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

const charities = [
  {
    name: "Auction 1",
    description: "",
        address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    imageSrc:
      "https://news.artnet.com/app/news-upload/2021/02/NYAN-CAT-ARTINTERVIEW-copy.jpg",
  },
  {
    name: "Auction 2",
    description:
      "",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    imageSrc:
      "https://thumbor.forbes.com/thumbor/fit-in/x/https://www.forbes.com/advisor/in/wp-content/uploads/2022/03/monkey-g412399084_1280.jpg",
  },
  {
    name: "Auction 3",
    description:
      "",
    address: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
    imageSrc:
      "https://www.gardeningknowhow.com/wp-content/uploads/2017/07/hardwood-tree.jpg",
  },
];

const Auction = () => {
  const [donated, setDonated] = useState(false);
  const [success, setSuccess] = useState(null);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDonate = async (amount: string, address: string) => {
    try {
      console.log("got here");
      try {
        await donate(amount, address);
        alert("donation successful");
        console.log("here again");
      } catch (error) {
        console.error(error);
      }
      // Update the UI to show the donation was successful
      setDonated(true);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 mt-10">
      <div className="flex flex-wrap -mx-4">
        {charities.map((charity, index) => (
          <div key={index} className="w-full md:w-1/2 lg:w-1/3 px-4 mb-8">
            <AuctionCard
              {...charity}
              onDonate={handleDonate}
              donated={donated}
            />
          </div>
        ))}
      </div>
    </div>
  );
};



export default Auction;