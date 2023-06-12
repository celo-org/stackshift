import React, { ChangeEvent, useState } from "react";
import CustomButton from "../CustomButton";
import FormInput from "../FormInput";
import { creatorWithdrawTip } from "../../utils/interact";
import { ethers } from "ethers";
import { useAccount } from "wagmi";

  interface IParams {
    id: number;
    walletAddress: string;
  }

export default function WithdrawModal(param: IParams): JSX.Element {
  const {address } = useAccount();
  const [amount, setAmount] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState<string>("")

  const amountHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value)
  }

  const walletHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setWalletAddress(e.currentTarget.value)
  }
  const withdrawTip = async () => {
    await creatorWithdrawTip(address, param.id, ethers.utils.parseUnits(amount, "ether"))
  }
  console.log("withdraw id", param.id)
  
  return (
    <div>
      <div className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="withdrawModal" tabIndex={-1} aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                Withdraw Tips
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <div className="modal-body relative p-4">
              <div className="flex justify-center flex flex-col">
                <FormInput placeholder="Amount" value={amount} onChange={amountHandler} type="number" />
                <FormInput placeholder="Wallet Address" value={param.walletAddress} onChange={amountHandler} type="text" disabled={true} />
              </div>
              <CustomButton text="Withdraw" myStyle="bg-amber-500 w-full" action={() =>{withdrawTip()}}/>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}