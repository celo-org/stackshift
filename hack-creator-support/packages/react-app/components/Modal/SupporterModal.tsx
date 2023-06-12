import React, {useState, useEffect} from 'react'
import { useAccount } from 'wagmi';
import { useRouter } from 'next/router';
import { sendTip } from '../../utils/CeloInteract';
import { ethers } from "ethers";
import FormInput from '../FormInput';
import CustomButton from '../CustomButton';

interface IParams {
  myId: number;
  username: string;
  walletAddress: string;
  show: boolean;
  onHide: () => void;
}
export default function SupporterModal(params: IParams) {

  const { address } = useAccount();
  const [amount, setAmount] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [comment, setComment] = useState<string>("")
  // const { route } = useRouter()
  const [resolveDomain, setResolveDomain] = useState<string | null>("")

  const amountHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value)
  }

  const commentHandler = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setComment(event.currentTarget.value)
    console.log(event.currentTarget.value)
  }

  const walletHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setWalletAddress(e.currentTarget.value)
  }

  const sendSupport = async () => {
    // await sendTip(address, comment, params.myId, ethers.utils.parseUnits(amount, "ether"))
    params.onHide()
    setAmount("")
    setComment("")
  }

  return (
    params.show ? 
    <div>
       <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-900 bg-opacity-60 w-full h-full outline-none">
            <div className="relative lg:w-1/2 md:w-full sm:w-full my-6 mx-auto">
              <div className="shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
                <div className="flex items-start justify-between p-5 border-b border-solid border-gray-300 rounded-t-md">
                  <h3 className="text-xl font-medium leading-normal text-gray-800">{`Support ${params.username} with`}</h3>
                  <button
                    className="box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                    onClick={params.onHide}
                  >
                    <span className="text-black border-2 p-2 rounded-l-full ">
                      X
                    </span>
                  </button>
                </div>
                <div className="relative p-6 flex-auto">
                    <div className="flex justify-center flex flex-col">
                      <FormInput placeholder="Amount" value={amount} onChange={amountHandler} type="number" />
                      <p className="black">{` id here : ${params.myId}`}</p> 
                      <textarea
                        className="
                          form-control
                          text-black
                          block
                          w-full
                          px-3
                          py-1.5
                          text-base
                          font-normal
                          text-gray-700
                          bg-white bg-clip-padding
                          border border-solid border-gray-300
                          rounded
                          transition
                          ease-in-out
                          m-0
                          focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none
                        "
                        id="exampleFormControlTextarea1"
                        rows={3}
                        placeholder="Say something nice (optional)!"
                        value={comment}
                        onChange={commentHandler}
                      >                  
                      </textarea>
                      <FormInput placeholder="Wallet address" value={ !resolveDomain ? params.walletAddress :  resolveDomain} onChange={walletHandler} type="text" disabled={true} />                         
                    </div>
                    <CustomButton text="Support" myStyle="bg-amber-500 w-full p-4" action={() =>{sendSupport()}}/>
              </div>
              </div>
            </div>
          </div> 
    </div>: null

    
  )}
