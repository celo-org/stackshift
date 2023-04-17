// @ts-nocheck
import React, { useState, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import auctionABI from "../abi/auction.json";
import { auctionAddress } from "../utils/constant";
import { Web3Storage } from "web3.storage";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function Auction() {
  const [fileUrl, setFileUrl] = useState(null);
  const nameRef = useRef();
  const descRef = useRef();
  const startBidRef = useRef();
  const startTRef = useRef();
  const endTRef = useRef();
  const reserveRef = useRef();
  const { data: signer } = useSigner();

  async function onChange(e) {
    const file = e.target.files[0];
    try {
      const client = new Web3Storage({
        token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweGNiRGZhNDBBYjBEZTcwNTkwNURERDg4RTAwOWMzOTM3OGEzOWRhMmYiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NDk5MjExMTU1NDYsIm5hbWUiOiJXZWIzIn0._kphTIOj4s98lZpgrkcHCSxAmW7j15CNEYd5qbWULjs",
      });

      const cid = await client.put(e.target.files, {
        name: file.name,
        maxRetries: 3,
      });

      const url = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      console.log(url);
      toast.success("Image uploaded successfully");
      setFileUrl(url);
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }
  const createAuctionContract = async () => {
    const auctionContract = new ethers.Contract(
      auctionAddress,
      auctionABI.abi,
      signer
    );
    return auctionContract;
  };

  const createAuction = async (evt) => {
    evt.preventDefault();
    const contract = await createAuctionContract();
    const id = toast.loading("Transaction in progress..");
    const name = nameRef.current.value;
    const desc = descRef.current.value;
    const start_bid = ethers.utils.parseEther(startBidRef.current.value);
    const start_time = Math.floor(
      new Date(startTRef.current.value).getTime() / 1000
    );
    const end_time = Math.floor(
      new Date(endTRef.current.value).getTime() / 1000
    );
    const reserve_price = ethers.utils.parseEther(reserveRef.current.value);

    try {
      const tx = await contract.createAuction(
        name,
        desc,
        start_bid,
        start_time,
        end_time,
        reserve_price,
        fileUrl,
        0
      );
      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => (window.location.href = "/"), 5000);
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  return (
    <div>
      <form onSubmit={createAuction} className="auction">
        <div className="text10">Create Auction</div>
        <div className="formflex">
          <div>
            <input onChange={onChange} type="file" />
          </div>
          <div className="formbox">
            <div className="input-box">
              <label className="label">Item Name</label>
              <input
                ref={nameRef}
                className="input"
                placeholder="Enter Item Name"
                required
              />
            </div>
            <div className="input-box">
              <label className="label">Item / Service Description</label>
              <textarea required ref={descRef} className="textarea"></textarea>
            </div>
            <div className="input-box">
              <label className="label">Starting Bid</label>
              <input
                ref={startBidRef}
                className="input"
                placeholder="Enter starting bid"
                required
              />
            </div>
            <div className="input-box">
              <label className="label">Start Time</label>
              <input
                className="input"
                type="datetime-local"
                placeholder="Select duration"
                ref={startTRef}
                required
              />
            </div>
            <div className="input-box">
              <label className="label">End Time</label>
              <input
                className="input"
                type="datetime-local"
                placeholder="Select duration"
                ref={endTRef}
                required
              />
            </div>
            <div className="input-box">
              <label className="label">Reserve Price</label>
              <input
                ref={reserveRef}
                className="input"
                placeholder="Reserve Price"
                required
              />
            </div>
            {/*  <div className="input-box">
              <label className="label">Auction Type</label>
              <input className="input" placeholder="Reserve Price" />
            </div> */}

            <button className="aubut">Create Auction</button>
          </div>
        </div>
      </form>
    </div>
  );
}
