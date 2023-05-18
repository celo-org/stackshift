/* eslint-disable @next/next/no-img-element */
/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useRef } from "react";
import Link from "next/link";
import { gql, useQuery } from "@apollo/client";
import ToucanClient from "toucan-sdk";
import { BigNumber, ContractReceipt } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { getProvider, fetchSigner } from "@wagmi/core";

export default function Home() {
  const provider = getProvider();

  const GET_TCOTOKENS = gql`
    query CarbonRedeem {
      tco2Tokens(first: 12) {
        symbol
        name
        score
        createdAt
        creationTx
        creator {
          id
        }
      }
    }
  `;

  const [contractReceipt, setcontractReceipt] = useState<ContractReceipt>();
  const [selectedToken, setSelectedToken] = useState<any>("");
  const { loading, error, data } = useQuery(GET_TCOTOKENS);

  const randomizeImage = () => {
    const id = Math.random();
    return `https://picsum.photos/200?random=${id}`;
  };

  const redeem = async (evt) => {
    const signer = await fetchSigner();

    if (!signer) {
      return;
    }
    try {
      const sdk = new ToucanClient("alfajores");
      sdk.setProvider(provider);
      sdk.setSigner(signer);
      const amountBN = BigNumber.from(evt.target.previousSibling.value);
      const contractReceipt = await sdk.redeemAuto(
        selectedToken,
        parseEther(amountBN.toString())
      );
      console.log(contractReceipt);
      setcontractReceipt(contractReceipt);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <div className="datalist">
        {data?.tco2Tokens.map((item) => {
          return (
            <div className="card" key={item.name}>
              <img
                className="img"
                src={randomizeImage()}
                alt={randomizeImage()}
              />
              <div className="text1">{item.name}</div>
              <div className="text2">{item.symbol}</div>
              <div className="text2">Score :{item.score}</div>
              {/*   <div>{item.creationTx}</div> */}

              <input className="input" placeholder="Enter Amount" />
              <button onClick={redeem} className="button">
                Redeem
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
