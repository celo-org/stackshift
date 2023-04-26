// @ts-nocheck
// @ts-nocheck
import React, { useState, useRef, useEffect } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import auctionABI from "../abi/auction.json";
import { auctionAddress } from "../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Link from "next/link";

export default function Profile() {
  const [state, setState] = useState(true);
  const [bid, setBid] = useState([]);
  const [acl, setAcl] = useState([]);
  const { address } = useAccount();
  const [bal, setBalance] = useState(0);
  const aidRef = useRef();

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

  const bb = async () => {
    const balance = await fetchBalance({
      address,
    });
    console.log("bal", balance);
    setBalance(ethers.BigNumber.from(balance.value) / 10 ** 18);
  };

  const withdrawBid = async (id) => {
    const contract = await createAuctionContract();
    const id2 = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.bidWithdraw(id);
      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => window.location.reload(), 3000);
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

  const bidRefund = async (id) => {
    const contract = await createAuctionContract();
    const id2 = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.bidRefund(id);
      await tx.wait();

      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      setTimeout(() => window.location.reload(), 3000);
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

  const getMyBid = async () => {
    const contract = await createAuctionContract();
    try {
      const auctions = await contract.fetchMyBids();

      const items = await Promise.all(
        auctions.map(async (i) => {
          const ac = await contract.AuctionData(i.auctionId);
          let item = {
            bid_amount: i.bid_amount,
            owner: i.owner,
            auctionId: i.auctionId,
            autoAmount: i.autoAmount,
            balance: i.balance,
            ac,
          };
          return item;
        })
      );

      console.log(items);
      setBid(items);
    } catch (error) {
      console.log(error);
    }
  };

  const getMyAuctions = async () => {
    const contract = await createAuctionContract();
    try {
      const auctions = await contract.fetchMyAuctions();
      console.log(auctions);
      setAcl(auctions);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getMyBid();
    getMyAuctions();
    bb();
  }, [signer]);
  return (
    <div>
      <div className="card2">
        <div className="text61">Wallet Balance - {bal}</div>
        <div className="text61">Withdraw Auction Balance</div>
        <div>
          <input
            ref={aidRef}
            className="winput"
            placeholder="Enter Auction Id"
          />
        </div>
        <button
          onClick={() => bidRefund(aidRef.current.value)}
          className="wbut"
        >
          Withdraw
        </button>
      </div>
      <div className="bbf">
        <button onClick={() => setState(true)} className="bb">
          Your Bid
        </button>
        <button onClick={() => setState(false)} className="bb">
          Auctions
        </button>
      </div>

      {state ? (
        <section className="profile-section1">
          <div className="home-section2-inner">
            <div className="text31">
              Find all items you have placed a bid on here
            </div>
          </div>
          <div className="live">
            {bid.map((item, index) => {
              return (
                <div key={index} className="card">
                  <img className="" src={item.ac.img} alt="hero" />
                  <div className="textflex1">
                    <div className="text5">{item.ac.name}</div>
                    <div className="text6">
                      {Math.round(
                        (Number(ethers.BigNumber.from(item.ac.end_time)) -
                          new Date().getTime() / 1000) /
                          60 /
                          60 /
                          24
                      ) >= 1 ? (
                        <span>
                          Ends in{" "}
                          {Math.round(
                            (Number(ethers.BigNumber.from(item.ac.end_time)) -
                              new Date().getTime() / 1000) /
                              60 /
                              60 /
                              24
                          )}{" "}
                          days
                        </span>
                      ) : (Number(ethers.BigNumber.from(item.ac.end_time)) -
                          new Date().getTime() / 1000) /
                          60 /
                          60 /
                          24 >
                        0 ? (
                        <span>
                          {" "}
                          Ends in{" "}
                          {Math.round(
                            (Number(ethers.BigNumber.from(item.ac.end_time)) -
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
                    {Number(ethers.BigNumber.from(item.ac.winningBid)) /
                      10 ** 18}
                  </div>
                  <div className="text7">
                    Auction Id - {Number(ethers.BigNumber.from(item.auctionId))}
                  </div>
                  <div className="text7">
                    Bid Amount -{" "}
                    {Number(ethers.BigNumber.from(item.bid_amount)) / 10 ** 18}
                  </div>
                  <div className="text7">
                    Auto Amount -{" "}
                    {Number(ethers.BigNumber.from(item.autoAmount)) / 10 ** 18}
                  </div>
                  <div className="text7">
                    Balance -{" "}
                    {Number(ethers.BigNumber.from(item.balance)) / 10 ** 18}
                  </div>
                  <div style={{ color: "blue" }} className="text7">
                    {(Number(ethers.BigNumber.from(item.ac.end_time)) -
                      new Date().getTime() / 1000) /
                      60 /
                      60 /
                      24 <=
                    0 ? (
                      <div>
                        {item.ac.winner === address
                          ? "You won the auction"
                          : ""}
                      </div>
                    ) : null}
                  </div>
                  <div className="bidflex">
                    <Link
                      href={`/detail/${Number(
                        ethers.BigNumber.from(item.auctionId)
                      )}`}
                    >
                      <button className="bidbut1">Edit Bid</button>
                    </Link>
                    <button
                      onClick={() => withdrawBid(item.auctionId)}
                      className="bidbut2"
                    >
                      Cancel Bid
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section className="profile-section1">
          <div className="home-section2-inner">
            <div className="text31">
              Find all items you have put up for auction here
            </div>
          </div>
          <div className="live">
            {acl.map((item, index) => {
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
                </div>
              );
            })}
          </div>
        </section>
      )}
    </div>
  );
}
