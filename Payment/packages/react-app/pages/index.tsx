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
import Link from "next/link";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const router = useRouter();
  const frRef = useRef();
  const groupRef = useRef();
  const usrRef = useRef();
  const { address } = useAccount();
  const [fr, setFr] = useState([1]);
  const [user, setUser] = useState("None");
  const [groupList, setGroup] = useState([]);
  const [spList, setSpList] = useState([]);
  const [request, setRequest] = useState([]);
  const [addr, setAddr] = useState("");
  const [flist, setList] = useState([]);
  const [bal, setBalance] = useState(0);
  const { data: signer } = useSigner();
  const userRef = useRef();
  const gRef = useRef();

  const createPayContract = async () => {
    const payContract = new ethers.Contract(
      payAddress,
      payABI.abi,
      signer || undefined
    );
    return payContract;
  };

  const addUsername = async (name: string) => {
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.setUsername(name);
      await tx.wait();
      const usr = await contract.getUsername(addr);
      console.log(usr);
      setUser(usr);
      usrRef.current.reset();
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

  const acceptOrReject = async (status, sid) => {
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.acceptOrRejectSplit(status, sid);
      await tx.wait();
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

  const createG = async (group, name) => {
    const contract = await createPayContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.createGroup(group, name);
      await tx.wait();
      const gr = await contract.fetchMyGroup();
      groupRef.current.reset();
      setGroup(gr);
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

  const getGroup = async () => {
    const contract = await createPayContract();
    try {
      const gr = await contract.fetchMyGroup();
      setGroup(gr);
    } catch (error) {
      console.log(error);
    }
  };

  const getSplit = async () => {
    const contract = await createPayContract();
    try {
      const splits = await contract.fetchMySplits();
      console.log(splits);
      setSpList(splits);
    } catch (error) {
      console.log(error);
    }
  };

  const getRequests = async () => {
    const contract = await createPayContract();
    try {
      const splits = await contract.getRequests(addr);
      console.log(splits);
      setRequest(splits);
    } catch (error) {
      console.log(error);
    }
  };

  const getUsername = async () => {
    const contract = await createPayContract();
    try {
      const usr = await contract.getUsername(addr);
      setUser(usr);
    } catch (error) {
      console.log(error);
    }
  };

  const add = (evt) => {
    evt.preventDefault();
    setFr([1, ...fr]);
  };

  const createGroup = (evt) => {
    evt.preventDefault();
    const arr = [];
    const children = Array.from(frRef.current.children);
    children.map((item) => {
      if (!ethers.utils.isAddress(item.value)) {
        toast.error("Invalid Address");
      }
      arr.push(item.value);
    });

    createG(arr, gRef.current.value);
  };

  const bb = async () => {
    const balance = await fetchBalance({
      address,
    });
    console.log("bal", balance);
    setBalance(ethers.BigNumber.from(balance.value) / 10 ** 18);
    setAddr(address);
  };

  useEffect(() => {
    bb();
    getGroup();
    getSplit();
    getRequests();
    getUsername();
  }, [addr, user, signer]);

  return (
    <div>
      <div className="split">
        <div className="split-flex2">
          <div className="claim">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Username
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">{user}</p>
            <h5 class="mb-2 mt-5 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Wallet Address
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">{addr}</p>
          </div>
          <div className="claim">
            <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">
              Wallet Balance
            </h5>
            <p class="font-normal text-gray-700 dark:text-gray-400">
              {bal} celo
            </p>
          </div>
        </div>
        <div className="split-flex3">
          <div class="w-full mx-auto my2 mt-20 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form
              ref={usrRef}
              onSubmit={(evt) => {
                evt.preventDefault();
                addUsername(userRef.current.value);
              }}
              class="space-y-6"
              action="#"
            >
              <h5 class="text-xl font-medium text-gray-900 dark:text-white">
                Add UserName
              </h5>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  UserName
                </label>
                <input
                  ref={userRef}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter username"
                  required
                />
              </div>
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add
              </button>
            </form>
          </div>
          <div class="w-full mx-auto mt-20 max-w-sm p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-6 md:p-8 dark:bg-gray-800 dark:border-gray-700">
            <form ref={groupRef} class="space-y-6" action="#">
              <h5 class="text-xl font-medium text-gray-900 dark:text-white">
                Create Group
              </h5>
              <div>
                <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Name of Group
                </label>
                <input
                  ref={gRef}
                  class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                  placeholder="Enter name of group"
                />
              </div>
              <div>
                <label class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                  Friend Address
                </label>
                <div ref={frRef}>
                  {fr.map((item, index) => {
                    return (
                      <input
                        key={index}
                        placeholder="Enter Address"
                        class="bg-gray-50 mt-3 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white"
                      />
                    );
                  })}
                </div>
              </div>
              <button
                onClick={add}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Add another Friend
              </button>
              <button
                onClick={createGroup}
                className="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
              >
                Create Group
              </button>
            </form>
          </div>
        </div>
        <div className="split-flex2">
          <div className="w-full max-auto mt-10 mx-10 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Split Requests
              </h5>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {request.map((item, index) => {
                  return (
                    <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.creator.slice(0, 5)}...i
                            {item.creator.slice(-3, -1)} wants you to accept
                            payment
                          </p>
                          <p className="text-sm text-gray-500 truncate dark:text-gray-400">
                            email@windster.com
                          </p>
                          <div className="butf">
                            <button
                              onClick={() =>
                                acceptOrReject(
                                  true,
                                  ethers.BigNumber.from(item.splitId)
                                )
                              }
                              className="but"
                            >
                              Accept
                            </button>
                            <button
                              onClick={() =>
                                acceptOrReject(
                                  false,
                                  ethers.BigNumber.from(item.splitId)
                                )
                              }
                              className="but"
                            >
                              Reject
                            </button>
                          </div>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {ethers.BigNumber.from(item.amount) / 10 ** 18} celo
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
          <div className="w-full max-auto mt-10 mx-10 max-w-md p-4 bg-white border border-gray-200 rounded-lg shadow sm:p-8 dark:bg-gray-800 dark:border-gray-700">
            <div className="flex items-center justify-between mb-4">
              <h5 className="text-xl font-bold leading-none text-gray-900 dark:text-white">
                Group
              </h5>
              <a
                href="#"
                className="text-sm font-medium text-blue-600 hover:underline dark:text-blue-500"
              >
                View all
              </a>
            </div>
            <div className="flow-root">
              <ul
                role="list"
                className="divide-y divide-gray-200 dark:divide-gray-700"
              >
                {groupList.map((item, index) => {
                  return (
                    <li key={index} className="py-3 sm:py-4">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0"></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-gray-900 truncate dark:text-white">
                            {item.name}
                          </p>
                        </div>
                        <div className="inline-flex items-center text-base font-semibold text-gray-900 dark:text-white">
                          {/*   $320 */}
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </div>

        <div class="relative tb overflow-x-auto">
          <h5
            style={{ color: "white", marginBottom: "30px" }}
            className="text-xl mt-5 font-bold leading-none text-gray-900 pt-5"
          >
            Split History
          </h5>
          <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
            <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
              <tr>
                <th scope="col" class="px-6 py-3">
                  Name
                </th>
                <th scope="col" class="px-6 py-3">
                  Amount
                </th>
                <th scope="col" class="px-6 py-3">
                  Amount Received
                </th>
                <th scope="col" class="px-6 py-3">
                  Recipient
                </th>
                <th scope="col" class="px-6 py-3">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {spList.map((item, index) => {
                return (
                  <tr
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      router.push(
                        `/detail/${ethers.BigNumber.from(item.splitId)}`
                      )
                    }
                    class="bg-white border-b dark:bg-gray-800 dark:border-gray-700"
                  >
                    <th
                      scope="row"
                      class="px-6 py-4 font-medium text-gray-900 whitespace-nowrap dark:text-white"
                    >
                      {item.name}
                    </th>
                    <td class="px-6 py-4">
                      {ethers.BigNumber.from(item.amount) / 10 ** 18} celo
                    </td>
                    <td class="px-6 py-4">
                      {ethers.BigNumber.from(item.amountReceivedByRecipient) /
                        10 ** 18}{" "}
                      celo
                    </td>
                    <td class="px-6 py-4">{item.recipient}</td>
                    <td class="px-6 py-4">{item.status}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
