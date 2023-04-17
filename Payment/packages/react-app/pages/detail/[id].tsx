/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useRouter } from "next/router";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import payABI from "../../abi/pay.json";
import { payAddress } from "../../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { lowerFirst, split } from "lodash";

export default function Detail() {
  const router = useRouter();
  const id = router.query.id;
  console.log(id);

  const [split, setSplit] = useState([]);
  const [fr, setFr] = useState([]);
  const [fr2, setFr2] = useState([]);
  const [amr, setAmr] = useState(0);
  const [amr2, setAmr2] = useState(0);
  const [flist, setList] = useState([]);
  const { data: signer } = useSigner();
  const [err, setErr] = useState("");
  const [groupList, setGroup] = useState([]);
  const [groupList2, setGroup2] = useState([]);
  const [spList, setSpList] = useState([]);
  const [sel, setSel] = useState("friends");

  const createPayContract = async () => {
    const payContract = new ethers.Contract(payAddress, payABI.abi, signer);
    return payContract;
  };

  const getSplit = async (id) => {
    const contract = await createPayContract();
    try {
      const split = await contract.getSplitData(id);
      setSplit(split);
      const amr =
        ethers.BigNumber.from(split.amountReceivedByRecipient) / 10 ** 18;
      const amr2 = ethers.BigNumber.from(split.amount) / 10 ** 18;
      setAmr(amr);
      setAmr2(amr2);

      let frData;
      let listF = [];

      console.log(split.friends);

      split.friends.map(async (item) => {
        frData = await contract.SplitStats(id, item);
        console.log("he", frData);
        listF.push(frData);
        setFr2(listF);
      });

      console.log("fr", fr2);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const id = router.query.id;
    getSplit(id);
  }, [signer]);

  return (
    <div>
      <div className="split">
        <div className="box">
          <div class=" p-4 mx-auto wid text-center bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <h5 class="mb-2 text-3xl font-bold text-gray-900 dark:text-white">
              Split Name - {split.name}
            </h5>
            <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Split Amount - {amr2} celo
            </p>
            <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Amount Received by Recipient - {amr} celo
            </p>
            <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Recipient - {split.recipient}
            </p>
            <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
              Split Status - {split.status}
            </p>
            <div>
              <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                Friends (Splitters)
              </p>
              {fr2.length > 0 ? (
                <div>
                  {fr2?.map((item) => {
                    return (
                      <div>
                        <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                          Address - {item.owner}
                        </p>
                        <p class="mb-5 text-base text-gray-500 sm:text-lg dark:text-gray-400">
                          Payment status -{" "}
                          {item.request === 0
                            ? "pending"
                            : item.request === 1
                            ? "paid"
                            : "rejected"}
                        </p>
                      </div>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
