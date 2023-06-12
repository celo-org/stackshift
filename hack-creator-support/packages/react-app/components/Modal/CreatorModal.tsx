import React, { ChangeEvent, useEffect, useState } from "react";
import CustomButton from "../CustomButton";
import FormInput from "../FormInput";
import { createCreator } from "../../utils/CeloInteract";
import { pinFileToPinata } from "../../pinata/PinFile";
import { removeSpace } from "../../utils/truncate";
import { useAccount } from "wagmi";

export default function CreatorModal(): JSX.Element {
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

  const userHandler = (e: React.FormEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value)
  }

  const bioHandler = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setBio(event.currentTarget.value)
    console.log(event.currentTarget.value)
  }

  const networkHandler = (e: ChangeEvent<HTMLSelectElement>) => {
    setNetwork(e.target.value)
    console.log(e.target.value)
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
    // await createCreator(address, removeSpace(username), pinataHash, bio, network)
    
  }

  return (
    <div>
      <div className="modal fade fixed top-0 left-0 hidden w-full h-full outline-none overflow-x-hidden overflow-y-auto" id="creatorModal" tabIndex={-1} aria-labelledby="exampleModalCenterTitle" aria-modal="true" role="dialog">
        <div className="modal-dialog modal-dialog-centered relative w-auto pointer-events-none">
          <div className="modal-content border-none shadow-lg relative flex flex-col w-full pointer-events-auto bg-white bg-clip-padding rounded-md outline-none text-current">
            <div className="modal-header flex flex-shrink-0 items-center justify-between p-4 border-b border-gray-200 rounded-t-md">
              <h5 className="text-xl font-medium leading-normal text-gray-800" id="exampleModalScrollableLabel">
                Setup your creator account
              </h5>
              <button type="button"
                className="btn-close box-content w-4 h-4 p-1 text-black border-none rounded-none opacity-50 focus:shadow-none focus:outline-none focus:opacity-100 hover:text-black hover:opacity-75 hover:no-underline"
                data-bs-dismiss="modal" aria-label="Close"></button>
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
                <label className="form-label inline-block mb-2 text-gray-700 my-2">Where would you like to receive your payment?</label>
               <select className="form-select appearance-none
                      block
                      w-full
                      px-3
                      py-1.5
                      my-2
                      text-base
                      font-normal
                      text-gray-700
                      bg-white bg-clip-padding bg-no-repeat
                      border border-solid border-gray-300
                      rounded
                      transition
                      ease-in-out
                      focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none" aria-label="Default select example" onChange={networkHandler}>
                        <option selected>Select Network</option>
                        <option value="80001">Polygon</option>
                        <option disabled value="2">Celo</option>
                        <option disabled value="3">Algorand</option>
                </select>
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
                text={"Create Account"}
                myStyle="bg-amber-500 w-full mt-4"
                action={() => { createAccount() }} />           
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}