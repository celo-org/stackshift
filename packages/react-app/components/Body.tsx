import React, { useState, useEffect, useCallback } from 'react';
import Image from "next/image";
import Web3 from "web3";
import { useCelo } from "@celo/react-celo";
import { newKitFromWeb3 } from "@celo/contractkit";


import GamifiedNFTABI from "../abi/onchainnft.json";

const contractAddress = "0xc84DBd9EAd44349b42fC02E3a2af7E6Bc343fC37";




export default function Body() {
  const [nft, setNft] = useState<string>('https://gateway.pinata.cloud/ipfs/QmYDya1pMsQ9sNhRP36JxhdpdUoARAjq84NMRZRNbLZGy6/0.jpg');

  const kit = useCelo();

  const contract = new kit.connection.web3.eth.Contract(GamifiedNFTABI, contractAddress);

  

  // const getNFT = useCallback(async () => {
  //   const contract = new kit.connection.web3.eth.Contract(GamifiedNFTABI, contractAddress);
  //   const tokenURI = await contract.methods.tokenURI(1).call();
  //   console.log(tokenURI)
  //   setNft(tokenURI);
  // }, [kit.connection.web3.eth.Contract, contractAddress]);

  // useEffect(() => {
  //   // getNFT();
  // }, [getNFT]);

  return (
    <div>
      <div className='mt-[40px]'>
        <p>Working first</p>
        <img
          src={nft}
          alt="dynamic nft"
          width={200}
          height={200}
        />
      </div>
    </div>
  )
}
