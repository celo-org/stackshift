import React, { useState, useCallback, useEffect } from 'react'
import { addReceipients, getReceipients, clearReceipients, fundContract, splitFund, getBalance } from '../interact'
import { useCelo } from '@celo/react-celo'

export default function Content() {
  const { address } = useCelo()
  const [receipient, setReceipients] = useState([])
  const [balance, setBalance] = useState(0)
  const [receipientAddress, setReceipientAddress] = useState("")
  const [amount, setAmount] = useState(0)

   const addReceipient = async () => {
     await addReceipients(address, receipientAddress)
  } 

  
  const addAddress = (e) => {
    setReceipientAddress(e.target.value)
    console.log(e.target.value)
  }
  
  const fundAccount = (e) => {
    setAmount(e.target.value)
    console.log(e.target.value)
  }

  const getAllReceipients = async () => {
    const res = await getReceipients()
    setReceipients(res)
  } 

  const contractbalance = async () => {
    const bal = await getBalance()
    setBalance(bal)
  } 
  

  useEffect(() => {
    getAllReceipients()
    contractbalance()
  }, [])


  return (
    <div className='grid grid-cols-2 flex-1 '>
      <div className='bg-black w-full text-white p-4'>  
        <h1 className='text-2xl'>List of added receipients</h1>  
        <table className='table-fixed border p-4'>
          <thead>
            <tr>
              <th>Id</th>
              <th>Receipient Address</th>
            </tr>
          </thead>
          <tbody>
            { !receipient ? null : receipient.map((item, index) => <tr>
              <td>{index + 1}</td>
              <td>{item}</td>
            </tr>  
            )}
          </tbody>
        </table>
        <button onClick={() => clearReceipients(address)} className='border p-4 bg-amber-600 text-white'>Clear Receipient</button>
      </div>
      <div className='p-4'>
        <h1 className='text-2xl mb-4'>{` Contract Balance: ${balance}`}</h1>  
        <h1 className='text-2xl'>Add Receipients</h1>  
        <input className='p-4 border' type="text" name="" id="" placeholder='Add receipient address' value={receipientAddress}
          onChange={addAddress} />
        <button onClick={addReceipient} className='border p-4 bg-blue-600 text-white'>Add Receipient</button>
        <button onClick={() => splitFund(address)} className='border p-4 bg-green-600 text-white'>Split Fund</button>
        <h1 className='text-2xl mt-4'>Fund account</h1>  
        <input className='p-4 border' type="number" name="" id="" placeholder='Fund account' value={amount} onChange={fundAccount} />
        <button onClick={() => fundContract(address, amount)} className='border p-4 bg-blue-600 text-white'>Fund account</button>

      </div>
    </div>
  )
}
