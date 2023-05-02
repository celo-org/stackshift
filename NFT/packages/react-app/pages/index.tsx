/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import nftABI from "../../hardhat/artifacts/contracts/NFT.sol/RNFT.json";
import { nftAddress } from "../utils/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

export default function Home() {
  const router = useRouter();
  const frRef = useRef();
  const groupRef = useRef();
  const usrRef = useRef();
  const [nftData, setData] = useState({});
  const { address } = useAccount();
  const { data: signer } = useSigner();

  const createNFTContract = async () => {
    const nftContract = new ethers.Contract(
      nftAddress,
      nftABI.abi,
      signer || undefined
    );
    return nftContract;
  };

  const mint = async () => {
    const contract = await createNFTContract();
    const id = toast.loading("Minting in progress..");
    try {
      const tx = await contract.mint();
      await tx.wait();
      const tokenId = await contract.Tokens(address);
      const check = (await contract.ownerOf(tokenId)) === address;
      let uri;
      let meta;
      if (check) {
        uri = await contract.tokenURI(tokenId);
        meta = await axios.get(uri, {
          headers: {
            Accept: "text/plain",
          },
        });
        setData(meta.data);
      }

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

  const getNFT = async () => {
    const contract = await createNFTContract();
    try {
      const tokenId = await contract.Tokens(address);
      const check = (await contract.ownerOf(tokenId)) === address;
      let uri;
      let meta;
      if (check) {
        uri = await contract.tokenURI(tokenId);
        meta = await axios.get(uri, {
          headers: {
            Accept: "text/plain",
          },
        });
        setData(meta.data);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getNFT();
  }, [signer]);

  return (
    <div>
      <div className="box">
        <h2 className="text">Random NFT</h2>

        <button onClick={mint} className="but">
          Mint
        </button>

        <img className="image" src={nftData.image} />
        <div className="text2">{nftData.name}</div>
      </div>
    </div>
  );
}
