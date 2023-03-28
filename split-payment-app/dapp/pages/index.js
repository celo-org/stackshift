import Head from "next/head";
import { useState } from "react";
import Web3 from "web3";
import { useCelo } from "@celo/react-celo";
import { abi } from "../spilter.abi";

import Link from "next/link";
import EqualModal from "@/components/Modals/EquallyModal";
import RatioModal from "@/components/Modals/RatioModal";

export default function Home() {
  const [openEqualModal, setOpenEqualModal] = useState(false);
  const [openRatioModal, setRatioModal] = useState(false);
  const [billAmount, setBillAmount] = useState("");
  const [numberOfParticipants, setNumberOfParticipants] = useState("");
  const {kit, address, connect} = useCelo();

  const contract = new kit.connection.web3.eth.Contract(
    abi,
    "0x1467F4e1dEaEe91a3095B69E6142Ff41c49812e2"
  );

  const submitBillAmountAndParticipants = (e) => {
    e.preventDefault();
    const web3 = new Web3(window.celo);
    console.log(contract)

    contract.methods.SetBillAmountAndParticipant(
      numberOfParticipants
    ).send({from: address, value: billAmount});
  };

  console.log(address);

  return (
    <>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className="bg-[url('/images/split_bg_image.jpg')] bg-center bg-no-repeat bg-cover h-screen py-3 relative z-0">        
        <div className="flex flex-col items-center justify-center h-[500px]">
          <h1 className="text-5xl font-semibold text-white">
            There Is Love In Sharing
          </h1>
          <p className="mt-2 font-medium text-blue-400">
            Split that bill today with friends
          </p>
          {address ? (
            <div className="mt-2">
              <form>
                <div className="flex justify-between items-center w-[450px] py-1">
                  <div>
                    <label className="text-sm text-white">
                      Enter Bill Amount
                    </label>
                    <div>
                      <input
                        type="text"
                        className="rounded-md outline-none px-2 py-1"
                        onChange={(e) => setBillAmount(e.target.value)}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm">
                      Enter Number of Participants
                    </label>
                    <div>
                      <input
                        type="text"
                        className="rounded-md outline-none px-2 py-1"
                        onChange={(e) =>
                          setNumberOfParticipants(e.target.value)
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="text-center mt-2">
                  <button
                    className="text-white bg-green-500 w-28 rounded-md py-2"
                    onClick={submitBillAmountAndParticipants}
                  >
                    Submit
                  </button>
                </div>
              </form>
              <div className="mt-8 text-center">
                <button className="bg-blue-500 text-white py-2 px-4 rounded-md mr-2" onClick={() => setOpenEqualModal(true)}>
                  Split bill equally
                </button>
                <button className="bg-purple-500 text-white py-2 px-4 rounded-md ml-2" onClick={() => setRatioModal(true)}>
                  Split bill by defined ratio
                </button>
              </div>
            </div>
          ) : (
            <button className="text-white bg-blue-500 w-28 rounded-md py-2 mt-4" onClick={() => connect().catch((e) => console.log(e.message))}>
              Connect Wallet
            </button>
          )}
        </div>
        <div className="text-end p-3 text-sm">
          <p>
            Picture By:{" "}
            <span>
              <Link
                href="https://www.pexels.com/@karolina-grabowska/"
                legacyBehavior
              >
                <a className="underline text-blue-700">Karolina Grabowska</a>
              </Link>
            </span>
          </p>
        </div>
        {openEqualModal ? (
          <EqualModal onClose={() => setOpenEqualModal(false)} address={address} contract={contract} />
        ) : null}
        {openRatioModal ? (
          <RatioModal onClose={() => setRatioModal(false)} address={address} contract={contract} />
        ) : null}
      </div>
    </>
  );
}
