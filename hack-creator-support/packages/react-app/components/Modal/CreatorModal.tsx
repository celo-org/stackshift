import React, { ChangeEvent, useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import FormInput from "../FormInput";
import { createCreator } from "../../utils/CeloInteract";
import { pinFileToPinata } from "../../pinata/PinFile";
import { removeSpace } from "../../utils/truncate";
import { useAccount } from "wagmi";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from "wagmi";
import { CONTRACT_ABI, CONTRACT_ADDRESS } from "@/Constants";
interface IParam {
  show: boolean
  onHide: () => void
}
export default function CreatorModal({show, onHide} : IParam): JSX.Element {
  const { address } = useAccount();
  const [username, setUsername] = useState<string>("")
  const [bio, setBio] = useState<string>("")
  const [network, setNetwork] = useState<string>("")
  const [walletAddress, setWalletAddress] = useState<string>("")
  const [profilePix, setProfilePix] = useState<string | File | number | readonly string[] | undefined>(undefined)
  const [resolveDomain, setResolveDomain] = useState<string | null >("")
  const [errorMessage, setErrorMessage] = useState<string>("")
  const [bioError, setBioError] = useState<string>("")
  const [photoError, setPhotoError] = useState<string>("")
  const [networkError, setNetworkError] = useState<string>("")
  const [pinStatus, setPinStatus] = useState<string>("")
  const [hash, setHash] = useState<string>("")

  const userHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value)
  }

  const bioHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.currentTarget.value)
    console.log(event.currentTarget.value)
  }

  const walletHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setWalletAddress(e.currentTarget.value)
  }

  const profileHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files != null) {
      setProfilePix(e.target.files[0]); 
      console.log(e.target.files[0])
    } 
  }

  const createAccount = async () => {
    if (username === "") {
      setErrorMessage("Username required!")
      return
    } else {
      setErrorMessage("")
    }
    if (bio === "") {
      setBioError("Brief bio required")
    }
    if (username.indexOf(' ') >= 0) {
      // setErrorMessage("Space not allowed here")
      setErrorMessage("Space not allowed here")
      return
    } 
    
    if( document.getElementById("formFile").files.length === 0 ){
      setPhotoError("Please upload your profile photo")   
      return
    } 

    if (network === "Select Network") {
      setNetworkError("Please select a network")
      console.log("select a network")
      return
    }

    const pinataHash = await pinFileToPinata(profilePix)
    setPinStatus(pinStatus)
    setHash(pinataHash)

    
    // await createCreator(address, removeSpace(username), pinataHash, bio, network)
    
  }

 
  
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'setCreatorDetail',
    args: [removeSpace(username), hash, bio, "alfajores" ],
  })

  // handle vote state
  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,     
  })

  const createCreatorAccount = async () => {
    await createAccount()
    write?.()
    // onHide()
  }

  return (
    <div>
      {show && (
        <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none bg-gray-900 bg-opacity-90 w-full h-full outline-none">
        <div className="relative lg:w-1/3 md:w-full sm:w-full my-6 mx-auto">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                Setup your creator account
              </h5>
              <button onClick={onHide} type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close">X</button>
            </div>
            <div className="modal-body relative p-4">
              <div className="flex justify-center flex flex-col">
                <FormInput placeholder="Enter username without space" value={username} onChange={userHandler} type="text" />
                <small className="text-red-500 mt-0 mb-4">{errorMessage}</small>
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
                  placeholder="Tell us a little about you. (Not more than 100 words)"
                  value={bio}
                  onChange={bioHandler}
                >                  
                </textarea>
                <small className="text-red-500 mt-0 mb-4">{bioError}</small>
                <small className="text-red-500 mt-0 mb-4">{networkError}</small>
                <label className="form-label inline-block mb-2 text-gray-700 my-2"> Wallet Address </label>
                <FormInput placeholder="Wallet Address" value={!resolveDomain  ? address as string : resolveDomain } disabled={true} type="text" onChange={walletHandler} />
                  <label htmlFor="formFile" className="form-label inline-block mb-2 text-gray-700 my-2">Upload your profile picture</label>
                  <input className="form-control 
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
                  focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" type="file" id="formFile" onChange={profileHandler} />
              </div>
              <small className="text-red-500 mt-0 mb-8">{photoError}</small>
              <p className="text-black">{ pinStatus}</p>
              <CustomButton
                text={ isLoading ? "Loading..." : "Create Account" }
                myStyle="bg-amber-500 w-full mt-4"
                action={() => { createCreatorAccount() }} />           
            </div>
          </div>
        </div>
      </div>
      )}
      
    </div>
  )
}