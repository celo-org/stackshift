import React, { useState, useEffect, useCallback  } from 'react'
import {
   getUsers,
  getContractBalance,
  registerUser,
  placeBet,
  closeBet
} from '@/interact'
import { useCelo } from '@celo/react-celo';



export default function Home() {

  const { kit, address } = useCelo()
  const [users, setUsers] = useState<any[]>([])
  const [amount, setAmount] = useState<string>("")
  const [selected, setSelected] = useState<string>("")

  const choices = [
    { text: 'Yes', value: '1' },
    { text: 'No', value: '0' }
  ]
  const handleSelected = (e : React.FormEvent<HTMLInputElement>) => {
    setSelected(e.currentTarget.value)
  }
  const handleAmount = (e : React.FormEvent<HTMLInputElement>) => {
    setAmount(e.currentTarget.value)
  }
  const fetchContractBalance = useCallback(async () => {
    await getContractBalance(kit);
  },[kit])

   const fetchUsers =useCallback(async () => {
    const response = await getUsers(kit)
    setUsers(response)
  },[kit])

  const handleRegisterUser = useCallback(async () => {
    await registerUser(address, kit);
  }, [kit, address])
  
   const handleEndBet = useCallback(async () => {
    await closeBet(address, kit);
  },[kit, address])

  const handleBet = useCallback(async () => {
    if (selected && amount) {
      await placeBet(address, kit, selected, amount);
    } else {
      alert("Fields are required!")
    }
  },[kit, address, amount, selected])
  

  useEffect(() => {
    fetchContractBalance()
    fetchUsers()
  }, [fetchContractBalance, fetchUsers])
 
  return (
    <div>
    {!address ? <div>Please connect your wallet</div> :  
        <div>
          <h1 className='text-4xl text-center m-4'>Decentralized Betting Platform</h1>
              <div className="flex ">
            <button
                onClick={handleRegisterUser}
                type="button"
                className="inline-block rounded bg-primary px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Register
            </button>            
            <button
                onClick={handleEndBet}
                type="button"
                className=" mx-2 inline-block rounded bg-teal-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Close Bet
            </button>
          </div>
          <div>
              <h1 className='my-4 text-lg'>Predict the trend of the Celo Price.If you are of the opinion that
              <br /> the price will go up select Yes otherwise No</h1>
            <div className='my-2'>
              {choices.map((item, index) => <div key={index}>
                    <input className='mx-2' type="radio" id="yes" name="choice" value={item.value} checked={selected === item.value}
                onChange={handleSelected} />
                    <label className='text-lg' htmlFor="yes">{item.text}</label>
                  </div>                    
               )}
            
              </div>             
                <input className='p-4 my-2 border-2 rounded' type="number" placeholder='Bet Amount' value={amount} onChange={handleAmount} />       
             <button
                onClick={handleBet}
                type="button"
                className="inline-block rounded p-4 mx-2 bg-red-500 px-6 pt-2.5 pb-2 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)]"
                data-te-ripple-init
                data-te-ripple-color="light">
                Place Bet
            </button> 
            </div>  
        </div>      
      }
    </div>   
  )
}
