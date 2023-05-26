/* eslint-disable */
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import { GET_ALL } from "../queries";
import { subgraphQuery } from "../utils";
import React, { useState, useEffect, useRef } from "react";
import { useSigner, useAccount } from "wagmi";
import { fetchBalance } from "@wagmi/core";
import { ethers } from "ethers";
import graphABI from "../abi/abi.json";
import { graphAddress } from "../utils/constant";
import { toast } from "react-toastify";
import Link from "next/link";
import { useRouter } from "next/router";
import "react-toastify/dist/ReactToastify.css";

export default function Home() {
  const formRef = useRef();
  const nameRef = useRef();
  const durationRef = useRef();
  const [taskList, setTaskList] = useState([]);
  const { data: signer } = useSigner();
  const createGraphContract = async () => {
    const payContract = new ethers.Contract(
      graphAddress,
      graphABI,
      signer || undefined
    );
    return payContract;
  };

  const create = async (evt) => {
    evt.preventDefault();
    const contract = await createGraphContract();
    const id = toast.loading("Transaction in progress..");
    try {
      const tx = await contract.createGravatar(
        nameRef.current.value,
        durationRef.current.value
      );
      await tx.wait();
      formRef.current.reset();
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
        render: `${error.reason}`,
        type: "error",
        isLoading: false,
        autoClose: 1000,
        closeButton: true,
      });
    }
  };

  const getTasks = async () => {
    const taskList = await subgraphQuery(GET_ALL());
    console.log(taskList);
    setTaskList(taskList.gravatars);
  };

  useEffect(() => {
    getTasks();
  }, []);

  return (
    <div>
      <main className="mort">
        <div className="home-text7">Create Task</div>

        <form onSubmit={create} ref={formRef}>
          <div className="input-box">
            <label className="label">Task Name</label>
            <input
              required
              className="input"
              placeholder="Enter the Task Name"
              ref={nameRef}
            />
          </div>
          <div className="input-box">
            <label className="label">Task Duration</label>
            <input
              required
              className="input"
              placeholder="Enter the Task  Duration"
              ref={durationRef}
            />
          </div>

          <button className="mbut">Submit</button>
        </form>
      </main>

      <table>
        <tbody>
          <tr>
            <th>Owner</th>
            <th>Task</th>
            <th>Duration</th>
          </tr>
          {taskList.map((item) => {
            return (
              <tr>
                <td>{item.owner}</td>
                <td>{item.displayName}</td>
                <td>{item.imageUrl}</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
