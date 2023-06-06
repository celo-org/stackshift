/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRef, useEffect, useState } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import nftABI from "../abis/nft.json";
import daoABI from "../abis/dao.json";
import { nftAddress, daoAddress } from "../utils/constant";
import { toast } from "react-toastify";
import { Web3Storage } from "web3.storage";
export default function Proposal() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const [fileUrl1, setFileUrl1] = useState("");
  const [fileUrl2, setFileUrl2] = useState("");

  const titleRef = useRef();
  const descRef = useRef();

  const createDAOContract = async () => {
    const daoContract = new ethers.Contract(
      daoAddress,
      daoABI,
      signer || undefined
    );
    return daoContract;
  };

  const create = async (evt) => {
    evt.preventDefault();

    const title = titleRef.current.value;
    const description = descRef.current.value;

    const id = toast.loading("Transaction in progress..");
    try {
      const contract = await createDAOContract();
      const tx = await contract.createProposal(title, description);
      await tx.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      window.location.href = "/dash";
    } catch (error) {
      console.log(error);
      toast.update(id, {
        render: `${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };
  return (
    <div>
      <main className="mort">
        <div className="home-text7">Create Proposal</div>

        <form onSubmit={create}>
          <div className="input-box">
            <label className="label">Proposal Title</label>
            <input
              ref={titleRef}
              required
              className="input"
              placeholder="Enter your Full Name"
            />
          </div>

          <div className="input-box">
            <label className="label">Proposal Description</label>
            <textarea ref={descRef} required className="tarea">
              {" "}
            </textarea>
          </div>

          <button className="mbut">Submit</button>
        </form>
      </main>
    </div>
  );
}
