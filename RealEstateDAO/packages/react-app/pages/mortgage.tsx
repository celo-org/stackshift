/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRef, useEffect, useState } from "react";
import { useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";
import nftABI from "../abis/nft.json";
import daoABI from "../abis/dao.json";
import { nftAddress, daoAddress } from "../utils/constant";
import { toast } from "react-toastify";
import { Web3Storage } from "web3.storage";

export default function Mortgage() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [price, setPrice] = useState(0);
  const [weight, setWeight] = useState(0);
  const [fileUrl1, setFileUrl1] = useState("");
  const [fileUrl2, setFileUrl2] = useState("");

  const nameRef = useRef();
  const incomeRef = useRef();
  const minRepayRef = useRef();
  const daoAdressRef = useRef();
  const mortDescRef = useRef();
  const mortAmountRef = useRef();

  const createDAOContract = async () => {
    const daoContract = new ethers.Contract(
      daoAddress,
      daoABI,
      signer || undefined
    );
    return daoContract;
  };

  async function onChange(e, fileType) {
    console.log(process.env.NEXT_PUBLIC_TOKEN);
    const file = e.target.files[0];
    try {
      toast.info("uploading image......");
      const client = new Web3Storage({
        token: process.env.NEXT_PUBLIC_TOKEN,
      });

      const cid = await client.put(e.target.files, {
        name: file.name,
        maxRetries: 3,
      });

      const url = `https://ipfs.io/ipfs/${cid}/${file.name}`;
      console.log(url);
      toast.success("img uploaded successfully");
      if (fileType === "1") {
        setFileUrl1(url);
      } else {
        setFileUrl2(url);
      }
    } catch (error) {
      console.log("Error uploading file: ", error);
    }
  }

  const create = async (evt) => {
    evt.preventDefault();
    if (fileUrl1 === "" || fileUrl2 === "") {
      return toast.error("Image upload in progress....");
    }
    const name = nameRef.current.value;
    const income = incomeRef.current.value;
    const incomeImage = fileUrl1;
    const minRepay = minRepayRef.current.value;
    const daoAdress = daoAdressRef.current.value;
    const mortDesc = mortDescRef.current.value;
    const mortImage = fileUrl2;
    const mortAmount = mortAmountRef.current.value;
    const id = toast.loading("Transaction in progress..");
    try {
      const contract = await createDAOContract();
      const tx = await contract.createMortgage(
        name,
        ethers.utils.parseEther(income),
        incomeImage,
        ethers.utils.parseEther(minRepay),
        daoAdress,
        mortDesc,
        mortImage,
        ethers.utils.parseEther(mortAmount)
      );
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
      <main onSubmit={create} className="mort">
        <div className="home-text7">Mortgage Application</div>

        <form>
          <div className="input-box">
            <label className="label">Full Name</label>
            <input
              ref={nameRef}
              className="input"
              placeholder="Enter your Full Name"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Monthly Income ($)</label>
            <input
              ref={incomeRef}
              className="input"
              placeholder="Enter your Monthly Income"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Image Proof of Monthy Income</label>
            <input
              className="input"
              onChange={(e) => onChange(e, "1")}
              type="file"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Minimum Monthly Repayment ($)</label>
            <input
              ref={minRepayRef}
              className="input"
              placeholder="Enter Minumum Monthly to be paid monthly"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">DAO Member Address (Guarantor)</label>
            <input
              ref={daoAdressRef}
              className="input"
              placeholder="Enter DAO member address"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Description of Mortgage Property</label>
            <input
              ref={mortDescRef}
              className="input"
              placeholder="Enter description of mortgage property"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Image Proof of Mortgage Property</label>
            <input
              onChange={(e) => onChange(e, "2")}
              className="input"
              type="file"
              required
            />
          </div>

          <div className="input-box">
            <label className="label">Requested Amount for Mortgage ($)</label>
            <input
              ref={mortAmountRef}
              className="input"
              placeholder="Enter reqested amount for mortgage"
              required
            />
          </div>

          <button className="mbut">Submit</button>
        </form>
      </main>
    </div>
  );
}
