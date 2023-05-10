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
  const amountRef = useRef();
  const amountRef2 = useRef();
  const { data: signer } = useSigner();
  const { address } = useAccount();
  const [balance, setBalance] = useState(0);
  const [car, setCar] = useState("");
  const createPayContract = async () => {
    const payContract = new ethers.Contract(
      payAddress,
      payABI.abi,
      signer || undefined
    );
    return payContract;
  };

  const getB = async () => {
    const contract = await createPayContract();
    try {
      const gr = await contract.winnings(address);
      setBalance(ethers.BigNumber.from(gr) / 10 ** 18);
      console.log(gr);
    } catch (error) {
      console.log(error);
    }
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
      console.log("la", gr);
    } catch (error) {
      console.log(error);
    }
  };

  const guess = async () => {
    if (car === "") {
      return toast.error("Please select one of the cars");
    }
    if (amountRef.current.value === "") {
      return toast.error("Please enter the bet amount");
    }

    const num = car === "car1" ? 1 : car === "car2" ? 2 : 3;

    console.log(num);
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const wrappedContract = WrapperBuilder.wrapLite(contract).usingPriceFeed(
        "redstone",
        { asset: "ENTROPY" }
      );

      let tx = await wrappedContract.guess(num, {
        value: ethers.utils.parseEther(amountRef.current.value),
      });

      let data = await wrappedContract.getuserLastGame();
      console.log("data", data);

      if (data.status === true) {
        toast.update(id, {
          render: "Congratulations....Your Guess was correct",
          type: "success",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });
      } else {
        toast.update(id, {
          render: "Sorry.....Your guess was wrong",
          type: "success",
          isLoading: false,
          autoClose: 1000,
          closeButton: true,
        });
      }
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

  const withdraw = async () => {
    if (amountRef2.current.value === "") {
      return toast.error("Please enter the amount");
    }
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.withdraw(
        ethers.utils.parseEther(amountRef2.current.value)
      );

      await tx.wait();

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
    getB();
  }, [signer]);
  return (
    <div>
      <div className="text1">Guessing Game</div>

      <div className="text2">
        The robot has chosen on of the cars below - You task is to guess the
        correct one and win double your stacking amount
      </div>

      <div className="carL">
        <img
          className="car"
          onClick={() => setCar("car1")}
          src="./car1.webp"
          alt="car"
        />
        <img
          className="car"
          onClick={() => setCar("car2")}
          src="./car2.webp"
          alt="car"
        />
        <img
          onClick={() => setCar("car3")}
          className="car"
          src="./car3.jpeg"
          alt="car"
        />
      </div>

      <div className="text3">
        {car.length > 0 ? <div>{car} has been selected</div> : ""}
      </div>

      <input
        ref={amountRef}
        className="input"
        placeholder="Enter your bet amount"
      />
      <button onClick={guess} className="but">
        Submit
      </button>

      <div className="wallet">
        <div className="text4">Winnings Balance - {balance}</div>

        <input
          ref={amountRef2}
          className="input2"
          placeholder="Enter your amount"
        />
        <button onClick={withdraw} className="but2">
          Withdraw
        </button>
      </div>
    </div>
  );
}
