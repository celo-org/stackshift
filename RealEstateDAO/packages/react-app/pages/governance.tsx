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

export default function Governance() {
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [weight, setWeight] = useState(0);
  const [proposals, setProposals] = useState([]);

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

  const getVoteWeight = async () => {
    const contract = await createNftContract();
    try {
      const weight = await contract.balanceOf(address);
      setWeight(Number(ethers.BigNumber.from(weight)));
    } catch (error) {
      console.log(error);
    }
  };

  const getProposals = async () => {
    const contract = await createDAOContract();
    try {
      const proposals = await contract.getProposals();
      const newArr = [...proposals];
      const result = newArr.sort((a, b) => {
        return (
          Number(ethers.BigNumber.from(b.deadline)) -
          Number(ethers.BigNumber.from(a.deadline))
        );
      });
      console.log(result);
      setProposals(result);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getVoteWeight();
    getProposals();
  }, [signer]);

  return (
    <div>
      <main>
        <div className="dash-header">
          <div className="int">
            <div>Votes</div>
            <div>{weight}</div>
          </div>
        </div>
        <section className="dash-section1">
          <div className="box1">
            <div className="prop" style={{ marginBottom: "50px" }}>
              <div
                style={{ marginRight: "30px", cursor: "pointer" }}
                className="home-text5 prop2"
              >
                Active Proposals
              </div>
              {/*  <div
                style={{ marginRight: "30px", cursor: "pointer" }}
                className="home-text5 prop2"
              >
                Completed Proposals
              </div> */}
            </div>

            <div>
              {proposals.map((item) => {
                return (
                  <Link
                    key={item.proposalId}
                    href={`/vote/${Number(
                      ethers.BigNumber.from(item.proposalId)
                    )}`}
                  >
                    <div className="bod" style={{ marginBottom: "20px" }}>
                      <div className="home-text8">
                        {item.title}{" "}
                        {Number(ethers.BigNumber.from(item.proposalId))}
                      </div>
                      <div style={{ display: "flex" }}>
                        <div
                          className="home-text9 "
                          style={{ marginRight: "20px" }}
                        >
                          {Number(ethers.BigNumber.from(item.deadline)) -
                            Math.floor(new Date().getTime() / 1000) >=
                          0
                            ? "Active"
                            : item.yesVotes > item.noVotes
                            ? "Passed"
                            : "Failed"}
                        </div>
                        <div className="home-text9 ">
                          {Number(ethers.BigNumber.from(item.deadline)) -
                            Math.floor(new Date().getTime() / 1000) >=
                          0
                            ? ""
                            : "DEADLINE_EXCEEDED"}
                        </div>
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
