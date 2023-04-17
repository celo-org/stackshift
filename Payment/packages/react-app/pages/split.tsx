/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import payABI from "../abi/pay.json";
import { payAddress } from "../utils/constant";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { split } from "lodash";

export default function Split() {
  const frRef = useRef();
  const frRef2 = useRef();
  const nameRef = useRef();
  const amountRef = useRef();
  const recRef = useRef();
  const [fr, setFr] = useState([1]);
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

  const add = (evt) => {
    evt.preventDefault();
    setFr([1, ...fr]);
  };

  const addSplit = async (
    amount,
    name,
    friendsAddress,
    friendsAmount,
    recipient
  ) => {
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.createSplit(
        amount,
        name,
        friendsAddress,
        friendsAmount,
        recipient
      );
      await tx.wait();
      const splits = await contract.fetchMySplits();
      setSpList(splits);
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

  const createS = async (evt) => {
    evt.preventDefault();
    const name = nameRef.current.value;
    const amount = amountRef.current.value;
    const recipient = recRef.current.value;

    if (name === "") {
      return toast.error("Please enter Split name");
    }
    if (amount === "") {
      return toast.error("Please enter Split amount");
    }
    if (recipient === "") {
      return toast.error("Please enter Split recipient");
    }
    const contract = await createPayContract();
    const arr = [];
    const children = Array.from(frRef.current.children);
    const children2 = Array.from(frRef2.current.children);

    if (sel === "friends") {
      children.map(async (item) => {
        if (
          item.children[0].value === "" ||
          item.children[1].children[0].value == "" ||
          item.children[1].children[1].value == ""
        ) {
          setErr("error");
          return toast.error("Please Enter all details");
        }
        if (!ethers.utils.isAddress(item.children[0].value)) {
          const addr = await contract.getAddress(item.children[0].value);
          if (addr === "0x0000000000000000000000000000000000000000") {
            setErr("error");
            return toast.error("Invalid Address or Username");
          }
        }
        arr.push([
          [
            item.children[0].value,
            item.children[1].children[0].value,
            item.children[1].children[1].value,
          ],
        ]);
      });
    } else {
      children2.map(async (item) => {
        if (
          item.children[0].value === "" ||
          item.children[1].children[0].value == "" ||
          item.children[1].children[1].value == ""
        ) {
          setErr("error");
          return toast.error("Please Enter all details");
        }
        if (!ethers.utils.isAddress(item.children[0].value)) {
          const addr = await contract.getAddress(item.children[0].value);
          if (addr === "0x0000000000000000000000000000000000000000") {
            setErr("error");
            return toast.error("Invalid Address or Username");
          }
        }
        arr.push([
          [
            item.children[0].value,
            item.children[1].children[0].value,
            item.children[1].children[1].value,
          ],
        ]);
      });
    }

    if (err === "error") {
      return toast.error("An error occured");
    }

    let totalR = 0;
    let totalA = 0;

    arr.map((item) => {
      totalR = totalR + Number(item[0][1]);
      totalA = totalA + Number(item[0][2]);
    });

    if (Number(totalA) > Number(amount) || Number(totalA) < Number(amount)) {
      return toast.error("Total Split is greater than or less than amount ");
    }

    if (totalR > 100 || totalR < 100) {
      return toast.error("Total Percent is greater than or less 100%");
    }

    let friendsAddress = [];
    let friendsAmount = [];

    arr.map((item) => {
      friendsAmount.push(ethers.utils.parseEther(item[0][2]));
      friendsAddress.push(item[0][0]);
    });

    const amm = ethers.utils.parseEther(amount);

    const obj = {
      amount,
      name,
      friendsAddress,
      friendsAmount,
      recipient,
    };

    console.log(obj);

    addSplit(amm, name, friendsAddress, friendsAmount, recipient);
  };

  const getNames = async (name) => {
    const contract = await createPayContract();
    try {
      const gr = await contract.fetchNameGroup(name);
      console.log(gr);
      setGroup2(gr);
    } catch (error) {
      console.log(error);
    }
  };

  const getGroup = async () => {
    const contract = await createPayContract();
    try {
      const gr = await contract.fetchMyGroup();
      setGroup(gr);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getGroup();
  }, [signer]);

  return (
    <div>
      <div className="split">
        <div className="split-flex">
          <div>
            <div class="w-full my mx-auto mt-20 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
              <form class="space-y-6" action="#">
                <h5 class="text-xl font-medium text-gray-900 dark:text-white">
                  Split Detail
                </h5>
                <div>
                  <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Name of Split
                  </label>
                  <input
                    ref={nameRef}
                    name="email"
                    id="email"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    placeholder="Enter name of split"
                    required
                  />
                </div>
                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Amount
                  </label>
                  <input
                    ref={amountRef}
                    placeholder="Enter Amount"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>

                <div>
                  <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                    Recipient Address
                  </label>
                  <input
                    ref={recRef}
                    placeholder="Enter Recipient Address"
                    class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                    required
                  />
                </div>
              </form>
            </div>

            <button onClick={createS} className="sbut">
              Create Split
            </button>
          </div>

          <div class="w-full mx-auto mt-20 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form class="space-y-6" action="#">
              <h5 class="text-xl font-medium text-gray-900 dark:text-white">
                Add Friends Or Group
              </h5>
              <div>
                <h3 class="mb-4 font-semibold text-gray-900 dark:text-white">
                  Select Friend or Group
                </h3>
                <ul class="w-48 text-sm font-medium text-gray-900 bg-white border border-gray-200 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white">
                  <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div class="flex items-center pl-3">
                      <input
                        id="list-radio-license"
                        type="radio"
                        name="list-radio"
                        onChange={() => setSel("friends")}
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        for="list-radio-license"
                        class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Friends{" "}
                      </label>
                    </div>
                  </li>
                  <li class="w-full border-b border-gray-200 rounded-t-lg dark:border-gray-600">
                    <div class="flex items-center pl-3">
                      <input
                        id="list-radio-id"
                        type="radio"
                        value=""
                        onChange={() => setSel("group")}
                        name="list-radio"
                        class="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-700 dark:focus:ring-offset-gray-700 focus:ring-2 dark:bg-gray-600 dark:border-gray-500"
                      />
                      <label
                        for="list-radio-id"
                        class="w-full py-3 ml-2 text-sm font-medium text-gray-900 dark:text-gray-300"
                      >
                        Group
                      </label>
                    </div>
                  </li>
                </ul>
              </div>

              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Friend Address
                </label>
                <span className="pb-3">
                  Total Percent should be equal to 100
                </span>
                <div ref={frRef}>
                  {fr.map((item, index) => {
                    return (
                      <div className="fr" key={index}>
                        <input
                          placeholder="Enter Address or Username"
                          class="bg-gray-50 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                        <div className="amf">
                          <input
                            onChange={(evt) => {
                              let am =
                                (Number(evt.target.value) / 100) *
                                Number(amountRef.current.value);
                              evt.target.nextSibling.value = am;
                            }}
                            placeholder="Enter % i.e 20"
                            class="bg-gray-50 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                          <input
                            placeholder="Enter Amount"
                            class="bg-gray-50 mx-2 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              <button
                onClick={add}
                class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add another Friend
              </button>

              <select
                onChange={(evt) => {
                  getNames(evt.target.value);
                }}
              >
                <option>Select Group</option>
                {groupList.map((item) => {
                  return (
                    <option key={item.name} value={item.name}>
                      {item.name}
                    </option>
                  );
                })}
              </select>
              {groupList2.length > 0 ? (
                <div className="pb-3">Total Percent should be equal to 100</div>
              ) : null}
              <div ref={frRef2}>
                {groupList2.map((item, index) => {
                  return (
                    <div className="fr" key={index}>
                      <input
                        placeholder="Enter Address or Username"
                        defaultValue={item}
                        class="bg-gray-50 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                      <div className="amf">
                        <input
                          placeholder="Enter Ratio"
                          onChange={(evt) => {
                            let am =
                              (Number(evt.target.value) / 100) *
                              Number(amountRef.current.value);
                            evt.target.nextSibling.value = am;
                          }}
                          class="bg-gray-50 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                        <input
                          placeholder="Enter Amount"
                          class="bg-gray-50 mx-2 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
