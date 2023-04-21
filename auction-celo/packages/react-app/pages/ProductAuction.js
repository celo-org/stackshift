import React, { useState, useEffect } from "react";

import { ethers } from "ethers";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import ProductAuctionAbi from "../../hardhat/artifacts/contracts/ProductAuction.sol/ProductAuction.json";

const ProductAuctionAddress = "0xC2AEC661b59d5b0Ed65E5D5c21d2Fa6f603e3b4d";

export default function ProductAuction() {
  const [walletAddress, setWalletAddress] = React.useState(null);
  const [accounts, setAccounts] = useState([]);
  const [highestBid, setHighestBid] = useState("");
  const [account, setAccount] = useState("");
  const [contract, setContract] = useState(null);
  const isConnected = Boolean(accounts[0]);
  const step = 5;
  const timeDuration = 600000; //10 min

  const Completionist = () => <span>Auction ended!</span>;

  const [bid, setBid] = useState(0);
  const [started, setStarted] = useState(false);

  async function connectAccount() {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setAccounts(accounts);

      initConnection();
    }
  }

  const handlerHighestBid = async (contractCelo) => {
    const transaction = await contractCelo.highestBid({
      gasLimit: 100000,
    });

    const txToString = ethers.utils.formatUnits(transaction, "wei");
    setHighestBid(Number(txToString));
    setBid(Number(txToString));
    console.log("response: ", transaction);
  };

  const handleEnd = async () => {
    const transaction = await contract.end({
      gasLimit: 100000,
    });
    await transaction.wait();
    console.log("response: ", transaction);
  };

  const handleBid = async () => {
    console.log(" Bid: ", bid);
    const transaction = await contract.bid({
      value: bid + step,
      gasLimit: 100000,
    });
    await transaction.wait();
    console.log("response: ", transaction);
    await handlerHighestBid();
  };

  const handleIncrement = () => {
    console.log("  highestBid: ", highestBid);
    console.log("   Bid: ", bid);
    setBid(bid + step);
  };

  const checkTimer = () => {
    if (localStorage.startTime) {
      let a = Date.parse(localStorage.startTime);
      let b = new Date();
      console.log(b - a);

      if (b - a > timeDuration) {
        let startTimer = false;
        localStorage.startTimer = startTimer;
        localStorage.removeItem("startTime");
      } else {
        let startTimer = true;
        localStorage.startTimer = startTimer;
      }
    }
  };

  const handleStart = async () => {
    const transaction = await contract.start({
      gasLimit: 100000,
    });
    await transaction.wait().then(() => {
      let startTimer = true;
      localStorage.startTimer = startTimer;

      let startTime = new Date();
      localStorage.startTime = startTime;
    });
    console.log("response: ", transaction);
  };

  const initConnection = async () => {
    if (typeof window.ethereum !== "undefined") {
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const newSigner = provider.getSigner();
      const contractCelo = new ethers.Contract(
        ProductAuctionAddress,
        ProductAuctionAbi.abi,
        newSigner
      );
      setAccount(accounts[0]);
      setContract(contractCelo);
      Date.parse(localStorage.startTime);

      handlerHighestBid(contractCelo);

      const id = setInterval(() => {
        handlerHighestBid(contractCelo);
        checkTimer();
      }, 5000);

      return () => {
        clearInterval(id);
      };
    } else {
      console.log("Please install Metamask!");
    }
  };

  useEffect(() => {
    initConnection();
  }, []);

  return (
    <div className="card">
      <div div className="card-body">
        <div className="flex flex-row">
          <div className="flex flex-row w-1/2 mt-10 mr-0">
            <button
              className=" bg-slate-700	 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
              onClick={connectAccount}
            >
              Connect {accounts}
            </button>
          </div>
        </div>

        <div className="flex flex-row">
          <div className="flex flex-row w-1/2 mt-10 mr-0">
            <button onClick={handleStart} className="py-3 p-5 underline">
              START BID
            </button>

            <button onClick={handleEnd} className="py-3 p-5 underline">
              END BID
            </button>
          </div>
        </div>

        <div>
          <img
            width="500"
            height="500"
            src="https://gateway.pinata.cloud/ipfs/QmfBs1Ff3HZBSUrTNJM2fAordCvykuPtzSsANY1Pq692yT?_gl=1*1stjj85*rs_ga*MjFjMzM5MWYtOThmMy00ZTA1LTljZTYtMzJlNTg2MmUyZTBh*rs_ga_5RMPXG14TE*MTY4MjA5NjM3MC4xNi4xLjE2ODIwOTY3MjEuNjAuMC4w"
            className="attachment-full size-full"
            alt=""
            loading="lazy"
          />
        </div>
        <h5 className="card-title text-slate-400 hover:text-sky-400">
          Highest bid now: {highestBid ? highestBid : 0} cCelo
        </h5>

        <h5 className="card-title text-slate-400 hover:text-sky-400">
          Your bid: {bid + step} cCelo
        </h5>
        <button
          className=" bg-slate-100 hover:bg-slate-300 text-black font-bold py-1 px-2 rounded mr-5"
          onClick={handleIncrement}
        >
          +
        </button>
        <button
          className="bg-blue-500 text-white rounded-md py-2 px-4 mt-4 hover:bg-blue-600"
          onClick={handleBid}
        >
          Bid
        </button>
      </div>
    </div>
  );
}
