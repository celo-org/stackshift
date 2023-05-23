/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import Link from "next/link";
import { useRef, useEffect, useState } from "react";
import { useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";
import nftABI from "../abis/nft.json";
import daoABI from "../abis/dao.json";
import { nftAddress, daoAddress } from "../utils/constant";
import { toast } from "react-toastify";

export default function Dash() {
  const numRef = useRef();
  const fundRef = useRef();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [price, setPrice] = useState(0);
  const [interest, setInterest] = useState(0);
  const [weight, setWeight] = useState(0);
  const [mortgage, setMortgage] = useState(false);
  const [mortList, setMortList] = useState([]);

  const createNftContract = async () => {
    const payContract = new ethers.Contract(
      nftAddress,
      nftABI,
      signer || undefined
    );
    return payContract;
  };

  const createDAOContract = async () => {
    const daoContract = new ethers.Contract(
      daoAddress,
      daoABI,
      signer || undefined
    );
    return daoContract;
  };

  const buyNFT = async () => {
    if (numRef.current.value === "") {
      return toast.error("Enter the number of nfts");
    }
    const id = toast.loading("Transaction in progress..");
    try {
      const contract = await createNftContract();
      const tx = await contract.mintMany(numRef.current.value, {
        value: ethers.utils.parseEther(
          String(price * Number(numRef.current.value))
        ),
      });
      await tx.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      window.location.reload();
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
  const acceptOrReject = async (mortId, voteId) => {
    const id = toast.loading("Transaction in progress..");
    try {
      const contract = await createDAOContract();
      const tx = await contract.approveMort(mortId, voteId);
      await tx.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      window.location.reload();
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

  const fund = async () => {
    if (fundRef.current.value === "") {
      return toast.error("Please enter proposal id");
    }
    const id = toast.loading("Transaction in progress..");
    try {
      const contract = await createDAOContract();
      const tx = await contract.executeProposal(fundRef.current.value);
      await tx.wait();
      toast.update(id, {
        render: "Transaction successfull",
        type: "success",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
      window.location.reload();
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

  const getPrice = async () => {
    const contract = await createNftContract();
    try {
      const price = await contract.price();
      setPrice(ethers.BigNumber.from(price) / 10 ** 18);
    } catch (error) {
      console.log(error);
    }
  };

  const getInterest = async () => {
    const contract = await createDAOContract();
    try {
      const interest = await contract.interest();
      setInterest(Number(ethers.BigNumber.from(interest)));
    } catch (error) {
      console.log(error);
    }
  };

  const getMortgages = async () => {
    const contract = await createDAOContract();
    try {
      const mort = await contract.getMortgage();
      console.log(mort);
      setMortList(mort);
    } catch (error) {
      console.log(error);
    }
  };

  const checkMortgage = async () => {
    const contract = await createDAOContract();
    try {
      const mort = await contract.mortgageGiven(address);
      setMortgage(mort);
    } catch (error) {
      console.log(error);
    }
  };

  const getVoteWeight = async () => {
    const contract = await createNftContract();
    try {
      const weight = await contract.balanceOf(address);
      setWeight(Number(ethers.BigNumber.from(weight)));
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getPrice();
    getVoteWeight();
    getInterest();
    checkMortgage();
    getMortgages();
  }, [signer]);

  return (
    <div>
      <main>
        <div className="dash-header">
          <div className="int">
            <div>Mortgage Interest</div>
            <div>{interest}%</div>
          </div>

          {mortgage ? (
            <div>
              <div>Amount Funded (plus interest) - $15000</div>
              <div>Amount Repaid - $5000</div>
            </div>
          ) : null}
        </div>
        <section className="dash-section1">
          <div className="box1">
            <div style={{ marginBottom: "50px" }}>
              <div className="home-text5">
                Join DAO or Increase Voting Weight
              </div>
              <input
                ref={numRef}
                className="dinput"
                placeholder="Enter Number of NFT"
              />
              <button onClick={buyNFT} className="but">
                Buy NFT
              </button>
            </div>
            <div>
              <div className="home-text5">Mortgage Repayment</div>
              <div>
                <input className="dinput" placeholder="Enter Amount" />
                <button className="but">Submit</button>
              </div>
            </div>
            <div>
              <div style={{ marginTop: "30px" }} className="home-text5">
                Fund Proposal
              </div>
              <div>
                <input
                  ref={fundRef}
                  className="dinput"
                  placeholder="Enter Proposal ID"
                />
                <button onClick={fund} className="but">
                  Submit
                </button>
              </div>
            </div>
          </div>
          <div className="box2">
            <div>
              <div className="home-text6">Voting Weight - {weight}</div>
            </div>

            <Link href="/mortgage">
              <button className="but2">Create Mortgage</button>
            </Link>
            <Link href="/proposal">
              <button className="but2">Create Proposal</button>
            </Link>
          </div>
        </section>
        {mortList.length > 0 ? (
          <section className="dash-section2">
            <div className="home-text10">Guarantor Request</div>
            {mortList.map((item) => {
              return (
                <div className="listflex" key={item?.creator}>
                  <div>
                    <div>{item?.name}</div>
                    <div>{item?.creator}</div>
                  </div>
                  <div className="butflex">
                    <button
                      onClick={() => acceptOrReject(item.mortgageId, 1)}
                      className="accept"
                    >
                      Accept
                    </button>
                    <button
                      onClick={() => acceptOrReject(item.mortgageId, 2)}
                      className="accept"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              );
            })}
          </section>
        ) : null}
      </main>
    </div>
  );
}
