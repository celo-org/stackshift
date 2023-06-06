/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { useRef, useEffect, useState } from "react";
import { useSigner, useAccount } from "wagmi";
import { ethers } from "ethers";
import nftABI from "../../abis/nft.json";
import daoABI from "../../abis/dao.json";
import { nftAddress, daoAddress } from "../../utils/constant";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

export default function Vote() {
  const router = useRouter();
  const id = router.query.id;
  console.log(id);
  const vRef1 = useRef();
  const vRef2 = useRef();
  const vRef3 = useRef();

  const numRef = useRef();
  const { address } = useAccount();
  const { data: signer } = useSigner();
  const [vote, setVote] = useState("");
  const [proposal, setproposal] = useState([]);
  const [deadline, setDeadline] = useState(0);
  const [mortgage, setMortgage] = useState([]);
  const [yes, setYes] = useState(0);
  const [no, setNo] = useState(0);
  const [abstain, setAbstain] = useState(0);

  const createDAOContract = async () => {
    const daoContract = new ethers.Contract(
      daoAddress,
      daoABI,
      signer || undefined
    );
    return daoContract;
  };

  const getProposal = async () => {
    const contract = await createDAOContract();
    try {
      const proposal = await contract.proposals(id);
      setDeadline(Number(ethers.BigNumber.from(proposal?.deadline)));
      setYes(Number(ethers.BigNumber.from(proposal?.yesVotes)));
      setNo(Number(ethers.BigNumber.from(proposal?.noVotes)));
      setAbstain(Number(ethers.BigNumber.from(proposal?.abstainVotes)));
      setproposal(proposal);

      const mortgage = await contract.mortgages(proposal.mortgageId);
      console.log(mortgage);
      setMortgage(mortgage);
      //setPrice(ethers.BigNumber.from(price) / 10 ** 18);
    } catch (error) {
      console.log(error);
    }
  };

  const mark = (id) => {
    if (id === 1) {
      vRef1.current.classList.add("mark");
      vRef2.current.classList.remove("mark");
      vRef3.current.classList.remove("mark");
      setVote(0);
    } else if (id === 2) {
      vRef2.current.classList.add("mark");
      vRef1.current.classList.remove("mark");
      vRef3.current.classList.remove("mark");
      setVote(1);
    } else {
      vRef3.current.classList.add("mark");
      vRef2.current.classList.remove("mark");
      vRef1.current.classList.remove("mark");
      setVote(2);
    }
  };

  const voteProposal = async () => {
    if (vote === "") {
      return toast.error("Please select an option");
    }
    const id1 = toast.loading("Transaction in progress..");
    try {
      const contract = await createDAOContract();
      const tx = await contract.voteOnProposal(id, vote);
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
      toast.update(id1, {
        render: `${error.message}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  useEffect(() => {
    getProposal();
  }, [signer]);
  return (
    <div>
      <main className="voting">
        <div className="pbox1">
          <div className="pbox2">
            <div
              style={{ color: "black", marginBottom: "20px" }}
              className="home-text10"
            >
              Proposal Details
            </div>
            <div style={{ color: "black" }} className="home-text11">
              Proposal Name
            </div>
            <div className="home-text111" style={{ color: "black" }}>
              {proposal?.title}
            </div>
            <div style={{ color: "black" }} className="home-text11">
              Proposal Description
            </div>
            <div className="home-text111" style={{ color: "black" }}>
              {proposal?.description}
            </div>
          </div>

          {mortgage.length > 0 && mortgage.name === proposal.title ? (
            <div
              style={{ marginTop: "30px", marginBottom: "30px" }}
              className="pbox2"
            >
              <div>
                <div
                  style={{ marginBottom: "30px", color: "black" }}
                  className="home-text10"
                >
                  Mortgage Details
                </div>

                <div className="home-text11">Recipient Name</div>
                <div className="home-text111">{mortgage.name}</div>
                <div className="home-text11">
                  Recipient Monthly Income -{" "}
                  {Number(ethers.BigNumber.from(mortgage.income)) / 10 ** 18}
                  {""} celo
                </div>
                <div className="home-text111">{mortgage.name}</div>

                <div className="home-text11">
                  Recipient Proof of Monthly Income
                  <img src={mortgage.incomeImage} alt="incomeImg" />
                </div>
                <div className="home-text11">Minimum Monthly Repayment </div>
                <div className="home-text111">
                  {" "}
                  {Number(ethers.BigNumber.from(mortgage.minRepay)) / 10 ** 18}
                  {""} celo
                </div>
                <div className="home-text11">
                  DAO member address (Guarantor)
                </div>
                <div className="home-text111">{mortgage.daoAdress}</div>
                <div className="home-text11">
                  Description of Mortgage Property
                </div>
                <div className="home-text111">{mortgage.mortDesc}</div>
                <div className="home-text11">
                  Proof of Mortgage Property
                  <img src={mortgage.mortImage} alt="incomeImg" />
                </div>

                <div className="home-text11">Amount Requested</div>
                <div className="home-text111">
                  {Number(ethers.BigNumber.from(mortgage.mortAmount)) /
                    10 ** 18}
                  {""} celo
                </div>
              </div>
            </div>
          ) : null}
        </div>

        <div className="pbox1">
          <div className="pbox3">
            <div
              style={{ textAlign: "center", paddingBottom: "10px" }}
              className="home-text10"
            >
              Cast your Vote
            </div>
            <div
              style={{ textAlign: "center", paddingBottom: "10px" }}
              className="home-text11"
            >
              Status -{" "}
              {deadline - Math.floor(new Date().getTime() / 1000) >= 0
                ? "ACTIVE"
                : "DEADLINE_EXCEEDED"}
            </div>

            <div style={{ marginTop: "30px" }}>
              <div onClick={() => mark(1)} ref={vRef1} className="vbut">
                Yes
              </div>
              <div onClick={() => mark(2)} ref={vRef2} className="vbut">
                No
              </div>
              <div onClick={() => mark(3)} ref={vRef3} className="vbut">
                Abstain
              </div>

              <button onClick={voteProposal} className="vbut2">
                Vote
              </button>
            </div>
          </div>

          <div
            className="pbox3"
            style={{ marginTop: "30px", marginBottom: "30px" }}
          >
            <div className="home-text10">Results</div>

            <div style={{ marginTop: "30px" }}>
              <div className="home-text11">Yes - {yes}</div>
              <div className="home-text11">No - {no}</div>
              <div className="home-text11">Abstain - {abstain}</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
