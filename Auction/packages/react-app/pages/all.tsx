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
import Image from "next/image";

export default function All() {
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
      console.log(auctions);
      setAuc(auctions);
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
          <div className="text3">Find Super Rare Items</div>
        </div>
        <div className="live">
          {auc.map((item, index) => {
            return (
              <div key={index} className="card">
                <Image className="" src={item.img} alt="hero" />
                <div className="textflex1">
                  <div className="text5">{item.name}</div>
                  <div className="text6">Ends in 3 minutes</div>
                </div>
                <div className="text7">
                  Current Bid -{" "}
                  {Number(ethers.BigNumber.from(item.start_bid) / 10 ** 18)}
                  celo
                </div>
                <div className="bidflex">
                  <Link
                    href={`/detail/${Number(
                      ethers.BigNumber.from(item.auctionId)
                    )}`}
                  >
                    <button className="bidbut1">Place a bid</button>
                  </Link>

                  <Link
                    href={`/auto/${Number(
                      ethers.BigNumber.from(item.auctionId)
                    )}`}
                  >
                    <button className="bidbut2">Auto Bid</button>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
