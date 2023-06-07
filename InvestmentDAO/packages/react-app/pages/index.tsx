import React, { useEffect, useState } from "react";
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction, useAccount, useContractRead } from 'wagmi'
import { CONTRACT_ABI, CONTRACT_ADDRESS, OWNER,TOKEN_ADDRESS, TOKEN_ABI } from '@/Constants'
import CreateProposalModal from "@/components/CreateProposalModal";
import TableList from "@/components/TableList";
import FaucetModal from "@/components/FaucetModal";
import { ethers } from 'ethers'

export default function Home() {
  const [showModal, setShowModal] = useState(false)
  const [showFaucetModal, setFaucetModal] = useState(false)
  const { address } = useAccount()
  const [joined, setJoined] = useState(false)

  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'addMember',
  })

  const { data, write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      hash: data?.hash,
  })

    // Get member status
  const memberStatus : any = useContractRead({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI.abi,
    functionName: 'getMemberStatus',
    chainId: 44787,
    args: [address]
  })

  useEffect(() => {
  // const alreadyJoined = memberStatus.data && memberStatus.data
    setJoined(memberStatus.data)
  },[memberStatus.data])

  const proposals : any = useContractRead({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'getAllProposals',
      chainId: 44787,
  })
  const [items, setItems] = useState<any[]>();

  const addItem = () => {
   return setItems(proposals.data)
  }

  const joinCommunity = () => {
    if (!address) {
      return alert("Please connect your wallet")
    } else {
      write?.()
    }
  }

   const approve = usePrepareContractWrite({
      address: TOKEN_ADDRESS,
      abi: TOKEN_ABI.abi,
      functionName: 'approve',
      args: [address, ethers.utils.parseUnits("5")],
    })

    const approveCall = useContractWrite(approve.config)
    // const approveState = useWaitForTransaction({
    //     hash: data?.hash,
    // })
  
    const transferFrom = usePrepareContractWrite({
      address: CONTRACT_ADDRESS,
      abi: CONTRACT_ABI.abi,
      functionName: 'fundAccount',
      args:[address, ethers.utils.parseUnits("100"), ]
    })

    const transferResponse = useContractWrite(transferFrom.config)
    const transferStatus = useWaitForTransaction({
        hash: data?.hash,
    })
  
  
  const handleSubmit = () => {
    // approveCall.write?.()
    transferResponse.write?.()
  }
 
  return (
        <div>
          <div>
            {joined ?
              
            <div>
            <button
              onClick={() => setShowModal(true)}
              type="button"
              className="inline-block ml-2 rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              data-te-ripple-init
              data-te-ripple-color="light">
              Create Proposal
              </button>
              
              {/* <button
                onClick={handleSubmit}
                type="button"
                className="inline-block rounded bg-primary px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                // data-te-toggle="modal"
                // data-te-target="#faucetModal"
                // data-te-ripple-init
                data-te-ripple-color="light">
                Get Token From Faucet
              </button> */}
              {/* <FaucetModal show={showFaucetModal} hide={() => setFaucetModal(false)} /> */}
            </div>
             :
              
              <button
                onClick={joinCommunity}
                type="button"
                className="inline-block rounded bg-green-500 px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Join Community
              </button>
            }
                      
          <CreateProposalModal getData={addItem} show={showModal} hide={() => setShowModal(false)} />
          
        </div>
        <TableList data={proposals.data} />
      </div>

  )
}
