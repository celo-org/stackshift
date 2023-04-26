// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import auctionABI from "../abi/auction.json";
import { auctionAddress } from "../utils/constant";
import Link from "next/link";
import { Web3Storage } from "web3.storage/dist/bundle.esm.min.js";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img from "next/img";
import { filter } from "lodash";

export default function Winners() {
  const { data: signer } = useSigner();
  const [auc, setAuc] = useState([]);

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
      const auctions = await contract.fetchAuctions();
      const filtered = auctions.filter(
        (item) => new Date().getTime() / 1000 > item.end_time
      );
      console.log("fil", filtered);
      const newA = [...filtered].reverse();
      setAuc(newA);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAuction();
  }, [signer]);
  return (
    <div>
      <section className="home-section2">
        <div className="home-section2-inner">
          <div className="text3">Winners</div>
        </div>
        <div className="live">
          {auc.map((item, index) => {
            return (
              <div key={index} className="card">
                <img className="" src={item.img} alt="hero" />
                <div className="textflex1">
                  <div className="text5">{item.name}</div>
                  <div className="text6">
                    {Math.round(
                      (Number(ethers.BigNumber.from(item.end_time)) -
                        new Date().getTime() / 1000) /
                        60 /
                        60 /
                        24
                    ) >= 1 ? (
                      <span>
                        Ends in{" "}
                        {Math.round(
                          (Number(ethers.BigNumber.from(item.end_time)) -
                            new Date().getTime() / 1000) /
                            60 /
                            60 /
                            24
                        )}{" "}
                        days
                      </span>
                    ) : Math.round(
                        (Number(ethers.BigNumber.from(item.end_time)) -
                          new Date().getTime() / 1000) /
                          60 /
                          60 /
                          24
                      ) > 0 ? (
                      <span>
                        {" "}
                        Ends in{" "}
                        {Math.round(
                          (Number(ethers.BigNumber.from(item.end_time)) -
                            new Date().getTime() / 1000) /
                            60
                        )}{" "}
                        minutes
                      </span>
                    ) : (
                      <span>Auction has ended</span>
                    )}
                  </div>
                </div>
                <div className="text7">
                  Winning Bid -{" "}
                  {Number(ethers.BigNumber.from(item.winningBid) / 10 ** 18)}
                  celo
                </div>
                <div className="text7">
                  Winner - {item.winner.slice(0, 5)}..
                  {item.winner.slice(-5, -1)}
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
