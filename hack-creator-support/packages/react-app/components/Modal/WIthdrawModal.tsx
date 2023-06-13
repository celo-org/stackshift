import React, { ChangeEvent, useState } from "react";
import CustomButton from "../CustomButton";
import FormInput from "../FormInput";
import { creatorWithdrawTip } from "../../utils/CeloInteract";
import { ethers } from "ethers";
import { useAccount } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/Constants";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
  interface IParams {
    id: number;
    walletAddress: string;
    show: boolean
    onHide: () => void
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

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'creatorWithdrawTip',
    args: [param.id, amount],
  })

  const { data, write } = useContractWrite(config)

  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,     
  })

  const withdrawTip = async () => {
    if (!amount) {
      return alert("Amount required")
    } else {
      write?.()
    }
  }
  
  return (
    <div>
      {param.show &&   
        (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-900 bg-opacity-90 w-full h-full outline-none" id="withdrawModal" >
        <div className="relative lg:w-1/3 md:w-full sm:w-full my-6 mx-autoe">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                Withdraw Tips
              </h5>
                <button type="button"
                  onClick={param.onHide}
                className="btn-close text-black box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close">X</button>
            </div>
            <div className="modal-body relative p-4">
              <div className="flex justify-center flex flex-col">
                <FormInput placeholder="Amount" value={amount} onChange={amountHandler} type="number" />
                <FormInput placeholder="Wallet Address" value={param.walletAddress} onChange={amountHandler} type="text" disabled={true} />
              </div>
              <CustomButton text={isLoading ? "Loading" : "Withdraw"} myStyle="bg-amber-500 w-full" action={() =>{withdrawTip()}}/>
            </div>
          </div>
        </div>
      </div>
      )}
    </div>
  )
}