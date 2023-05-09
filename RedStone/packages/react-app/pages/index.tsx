/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import payABI from "../abi/pay.json";
import { payAddress } from "../utils/constant";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import { WrapperBuilder } from "redstone-evm-connector";

export default function Home() {
  const { data: signer } = useSigner();
  const createPayContract = async () => {
    const payContract = new ethers.Contract(
      payAddress,
      payABI.abi,
      signer || undefined
    );
    return payContract;
  };

  const getHistory = async () => {
    const contract = await createPayContract();
    try {
      const gr = await contract.getUserHistory();
      console.log(gr);
    } catch (error) {
      console.log(error);
    }
  };

  const getLast = async () => {
    const contract = await createPayContract();
    try {
      const gr = await contract.getuserLastGame();
      console.log(gr);
    } catch (error) {
      console.log(error);
    }
  };

  const random = async () => {
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const wrappedContract = WrapperBuilder.wrapLite(contract).usingPriceFeed(
        "redstone",
        { asset: "ENTROPY" }
      );

      let tx = await wrappedContract.guess(1, {
        value: ethers.utils.parseEther("0.1"),
      });

      //const tx = await contract.setUsername(name);
      //await tx.wait();

      let data = await wrappedContract.getuserLastGame();
      console.log(data);
      //const usr = await contract.getUsername(addr);
      //console.log(usr);
      //setUser(usr);
      //usrRef.current.reset();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
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

  useEffect(() => {
    getHistory();
    getLast();
  }, [signer]);
  return (
    <div>
      <div className="h1">
        <button onClick={random}>Random</button>
      </div>
    </div>
  );
}
