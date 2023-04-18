// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import auctionABI from "../abi/auction.json";
import { auctionAddress } from "../utils/constant";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Home() {
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
      <section className="home-section1">
        <div className="box1">
          <div className="text1">Find Rare Items on Auktion </div>
          <div className="text2">
            Start browsing our auctions today and discover the rare item that
            you have been searching for.
          </div>
        </div>
        <img className="hero" src="./hero.png" alt="hero" />
      </section>

      <section className="home-section2">
        <div className="home-section2-inner">
          <div className="text3">Live Auctions</div>
          <Link href="/all">
            <div className="text4">View all auctions</div>
          </Link>
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
                  Current Bid -{" "}
                  {Number(ethers.BigNumber.from(item.winningBid) / 10 ** 18)}
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

      <section className="home-section3">
        <div className="home-section2-inner">
          <div className="text3">Explore</div>
          <div className="text4">View all auctions</div>
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
                  Current Bid -{" "}
                  {Number(ethers.BigNumber.from(item.winningBid) / 10 ** 18)}
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

      <section className="home-section4">
        <div className="textbox">
          <div className="text8">About Auktion</div>
          <div className="text9">
            Our platform brings together buyers and sellers from around the
            world, offering a truly global marketplace for the most sought-after
            items. From automobiles to artworks and rare sculptures to antique
            furniture, you will find it all here, with new items added daily.
          </div>
        </div>
        <img className="boximg" src="./box.png" alt="hero" />
      </section>
    </div>
  );
}
