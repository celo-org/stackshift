import Image from "next/image";
import { Inter } from "next/font/google";
import { useCelo } from "@celo/react-celo";
import { useState, useEffect } from "react";
import Web3 from "web3";

import abi from "@/dynamicNFT.abi";
import AddTokenURI from "@/components/tokenURIModal";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  const { address, kit, connect } = useCelo();

  const [ownerAddress, setOwnerAddress] = useState("");
  const [openTokenURI, setOpenTokenURI] = useState(false);
  const [openMintNFT, setOpenMintNFT] = useState(false);
  const [openMintTo, setOpenMintTo] = useState(false);
  const [numOfNft, setNumOfNft] = useState("");
  const [destinationAddress, setDestinationAddress] = useState("");

  const contract = new kit.connection.web3.eth.Contract(
    abi,
    "0x8330A97cD8a8704eE8aF67E7a6F02C432191400D"
  );

  const getOwnerAddress = async () => {
    let response = "";
    response = await contract.methods.contractOwner().call();
    if (response) {
      setOwnerAddress(response);
    }
  };

  useEffect(() => {
    if (address) {
      getOwnerAddress();
    }
  }, [address]);

  const mintNft = async (e) => {
    e.preventDefault();
    const tokenCost = parseInt(numOfNft) * 1;
    console.log(numOfNft, tokenCost.toString());
    const response = await contract.methods
      .mint(numOfNft)
      .send({ from: address, value: tokenCost.toString() });
    console.log(response);
  };

  const mintNftTo = async (e) => {
    e.preventDefault();
    const tokenCost = parseInt(numOfNft) * 1;
    console.log(numOfNft, tokenCost);
    console.log(destinationAddress);
    const response = await contract.methods
      .mintTo(numOfNft, destinationAddress)
      .send({ from: address, value: tokenCost.toString() });
    console.log(response);
  };

  return (
    <div className={`${inter.className}`}>
      {address ? (
        <div className="relative">
          {address === ownerAddress ? (
            <header className="p-4">
              <div className="text-end">
                <button
                  className="bg-blue-500 rounded-md p-2"
                  onClick={() => setOpenTokenURI(true)}
                >
                  Add NFT
                </button>
              </div>
            </header>
          ) : null}

          <div className="flex flex-col justify-center items-center">
            <div className="shadow-xl rounded-md relative h-fit">
              <div className="w-full">
                <Image
                  src="/images/lagos.jpg"
                  alt=""
                  width={350}
                  height={350}
                  className="w-full object-contain relative"
                />
              </div>
              <div className="p-3">
                <div>
                  <h3 className="font-bold text-lg mb-2"></h3>
                  <p className="text-sm"></p>
                </div>
                <div className="mt-3">
                  <div className="text-sm">
                    <p></p>
                  </div>
                  {openMintNFT ? (
                    <div>
                      <div
                        className="text-end p-3 text-xl font-thin cursor-pointer"
                        onClick={() => setOpenMintNFT(false)}
                      >
                        x
                      </div>
                      <div className="flex flex-col justify-center items-center pt-2">
                        <form onSubmit={mintNft}>
                          <input
                            type="text"
                            placeholder="Enter Number of NFT"
                            className="rounded-md p-1.5 outline-none text-black"
                            onChange={(e) => setNumOfNft(e.target.value)}
                          />
                          <div className="text-center">
                            <button className="p-2 bg-blue-600 rounded-md mt-2">
                              Mint NFT
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : openMintTo ? (
                    <div>
                      <div
                        className="text-end p-3 text-xl font-thin cursor-pointer"
                        onClick={() => setOpenMintTo(false)}
                      >
                        x
                      </div>
                      <div className="flex flex-col justify-center items-center pt-2">
                        <form onSubmit={mintNftTo}>
                          <div>
                            <input
                              type="text"
                              placeholder="Enter Number of NFT"
                              className="rounded-md p-1.5 mb-1.5 outline-none text-black"
                              onChange={(e) => setNumOfNft(e.target.value)}
                            />
                          </div>
                          <div>
                            <input
                              type="text"
                              placeholder="Enter Destination Address"
                              className="rounded-md p-1.5 mt-1.5 outline-none text-black"
                              onChange={(e) =>
                                setDestinationAddress(e.target.value)
                              }
                            />
                          </div>
                          <div className="text-center">
                            <button className="p-2 bg-blue-600 rounded-md mt-2">
                              Mint NFT
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full flex justify-between">
                      <button
                        className="bg-green-500 text-white py-2 rounded mt-4 w-[10rem]"
                        onClick={() => setOpenMintNFT(true)}
                      >
                        Mint
                      </button>

                      <button
                        className="bg-green-500 text-white py-2 rounded mt-4 w-[10rem]"
                        onClick={() => setOpenMintTo(true)}
                      >
                        Mint To
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <button
          className="text-white bg-green-500 rounded-md p-2"
          onClick={connect}
        >
          Connect Wallet
        </button>
      )}
      {openTokenURI ? (
        <AddTokenURI
          onClose={() => setOpenTokenURI(false)}
          contract={contract}
        />
      ) : null}
    </div>
  );
}
