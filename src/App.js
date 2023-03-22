import { useEffect, useState } from 'react'
import { ethers } from 'ethers'
import { useContract } from './hooks'
import { contractAddress, NODE_URL } from './utils'
import { newKit } from '@celo/contractkit'

import FundSplitter from './artifacts/contracts/FundSplitter.sol/FundSplitter.json'
import AppHeader from "./components/Header";

const kit = newKit(NODE_URL)

const provider = new ethers.providers.Web3Provider(kit.web3.currentProvider)
const signer = provider.getSigner()

function App() {

  const [loading, setLoading] = useState(false)
  const [participant, setParticipant] = useState('')
  const [fund, setFund] = useState('')
  const [balance, setBalance] = useState('')
  const [participants, setParticipants] = useState(undefined)
  const FundSplitterContract = useContract(FundSplitter.abi, contractAddress, signer)

  const setParticipantHandler = async () => {
    setLoading(true)
    const tx = await FundSplitterContract.addParticipant(participant)
    const receipt = await tx.wait()
    reset()
    await getParticipants()
    console.log('Transaction receipt:', receipt)
  }

  const resetParticipant = async () => {
    setLoading(true)
    await FundSplitterContract.resetParticipants()
    setLoading(false)
    setParticipant(undefined)
  }

  const getParticipants = async () => {
    const result = await FundSplitterContract.getParticipants()
    setParticipants(result)
  }

  const getFund = async () => {
    const result = await FundSplitterContract.getContractBalance()
    setBalance(ethers.utils.formatEther(result))
  }

  const splitBill = async () => {

    if (!balance) return alert('Amount not set')

    // Create a transaction object for the sendEther function call
    try {
      setLoading(true)
      const txObject = await FundSplitterContract.splitBill()

      // Sign the transaction with the current account
      const signedTx = await kit.sendTransaction(txObject)

      // Wait for the transaction to be confirmed
      const receipt = await signedTx.wait()

      setLoading(false)

      alert('Fund splitted equally')
      console.log('Transaction receipt:', receipt)
    } catch (e) {
      console.log(e)
      setLoading(false)

    }

  }

  async function transferToContract() {
    setLoading(true)

    try {
      setLoading(true)
      let amount = kit.web3.utils.toWei(fund, "ether");
      let contract = await kit.contracts.getGoldToken();
      const accounts = await kit.web3.eth.getAccounts(); // get a list of available accounts on the network
      const from = accounts[0]; // use the first account as the sender
      await contract
        .transfer(contractAddress, amount)
        .send({from});

      setLoading(false)
      setFund('')
      document.getElementById('fund').value = ''

      await getFund()
    } catch (e) {
      console.log(e)
    }

    setLoading(false)

    await getFund()
  }

  const reset = () => {
    setParticipant('')
    document.getElementById('participant').value = ''
    setLoading(false)
  }

  useEffect(() => {
    const account = kit.connection.web3.eth.accounts.privateKeyToAccount(process.env.REACT_APP_PRIVATE_KEY)
    kit.connection.addAccount(account.privateKey)


    if (FundSplitterContract) {
      getParticipants()
      getFund()
    }

  }, [FundSplitterContract, getFund()])

  return (
    <div>
      <AppHeader />
      <div className="w-1/2 mx-auto flex flex-col">
        <h1 className='text-center mt-6 font-bold'>{balance} CELO</h1>
        <div className="form-group mb-6">
          <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700">Participant</label>
          <input onChange={e => setParticipant(e.target.value)} id={'participant'}
                 className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 placeholder="Add Participant"/>
        </div>
        <button onClick={setParticipantHandler} type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg transition duration-150 ease-in-out ml-1">
          Add Participant
        </button>

        <div className="form-group mb-6">
          <label htmlFor="name" className="form-label inline-block mb-2 text-gray-700">Fund</label>
          <input onChange={e => setFund(e.target.value)} id={'fund'}
                 className="form-control block w-full px-3 py-1.5 text-base font-normal text-gray-700 bg-white bg-clip-padding border border-solid border-gray-300 rounded transition ease-in-out m-0 focus:text-gray-700 focus:bg-white focus:border-blue-600 focus:outline-none"
                 placeholder="Add Fund"/>
        </div>

        <button onClick={transferToContract} type="button"
                className="inline-block px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-600 hover:shadow-lg focus:bg-blue-600 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-600 active:shadow-lg transition duration-150 ease-in-out ml-1">
          Add Fund
        </button>

        <div className="flex mt-10">
          <button onClick={splitBill} type="button"
                  className="w-1/2 inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-300 active:shadow-lg transition duration-150 ease-in-out ml-1">
            Split Fund
          </button>

          <button onClick={resetParticipant} type="button"
                  className="w-1/2 inline-block px-6 py-2.5 bg-gray-400 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-gray-300 hover:shadow-lg focus:bg-gray-300 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-gray-300 active:shadow-lg transition duration-150 ease-in-out ml-1">
            Reset Participant
          </button>
        </div>

        <div className={'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2'}>
          {loading && <div className="flex justify-center items-center z-50">
            <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full" role="status">
              <span className="visually-hidden"></span>
            </div>
          </div>}
        </div>

        {participants && participants.map((p, i) => (<p key={i}>{p}</p>))}</div>
    </div>
  )
}

export default App
