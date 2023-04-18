// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import auctionABI from "../../abi/auction.json";
import { auctionAddress } from "../../utils/constant";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";
import img from "next/img";
import { useRouter } from "next/router";

export default function Detail1() {
  const router = useRouter();
  const { data: signer } = useSigner();
  const [auc, setAuc] = useState([]);
  const [bd, setBd] = useState(0);
  const id = router.query.id;
  const amountRef = useRef();

  const createAuctionContract = async () => {
    const auctionContract = new ethers.Contract(
      auctionAddress,
      auctionABI.abi,
      signer
    );
    return auctionContract;
  };

  const getAuction = async () => {
    const contract = await createAuctionContract();
    try {
      const auctions = await contract.AuctionData(id);
      console.log("ac", auctions);
      setAuc(auctions);
    } catch (error) {
      console.log(error);
    }
  };

  const bid = async (evt) => {
    evt.preventDefault();
    const contract = await createAuctionContract();
    const id2 = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.bid(id, {
        value: ethers.utils.parseEther(amountRef.current.value),
      });
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
      toast.update(id2, {
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    getAuction();
  }, [id]);

  return (
    <div>
      <form onSubmit={bid} className="detail">
        <div className="detail1">
          <img src={auc.img} alt="art" />
        </div>
        <div className="detail2">
          <div className="dtf">
            <div className="detail-text1 ">{auc.name}</div>

            <div className="detail-text2">
              {Math.round(
                (Number(auc.end_time) - new Date().getTime() / 1000) /
                  60 /
                  60 /
                  24
              ) >= 1 ? (
                <span>
                  Ends in{" "}
                  {Math.round(
                    (Number(auc.end_time) - new Date().getTime() / 1000) /
                      60 /
                      60 /
                      24
                  )}{" "}
                  days
                </span>
              ) : Math.round(
                  (Number(auc.end_time) - new Date().getTime() / 1000) /
                    60 /
                    60 /
                    24
                ) > 0 ? (
                <span>
                  {" "}
                  Ends in{" "}
                  {Math.round(
                    (Number(auc.end_time) - new Date().getTime() / 1000) / 60
                  )}{" "}
                  minutes
                </span>
              ) : (
                <span>Auction has ended</span>
              )}
            </div>
          </div>

          <div className="detail-text3">{auc.desc}</div>
          <div className="detail-text4 ">Current Bid</div>
          <div className="detail-text5">
            {Number(auc.winningBid) / 10 ** 18} celo
          </div>
          <div>
            <input
              ref={amountRef}
              className="detail-input"
              placeholder="Enter bid price"
            />
          </div>

          <button className="detailbut">Place a bid</button>
        </div>
      </form>
    </div>
  );
}
