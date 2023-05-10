import React, {useEffect, useState} from "react"
import { useContractRead, useContractWrite, usePrepareContractWrite, useWaitForTransaction } from "wagmi"
import CONTRACT_ABI from "../Storage.json" 
import { useAccount } from "wagmi"
import { gql, useQuery } from "@apollo/client";
import { timeStamp } from "console";

export default function Home() {
  const [update, setUpdate] = useState<string>('')
  const CONTRACT_ADDRESS = "0x5ba3ec4808A655381452f4b58C929e4200B4DF69"
  const { address } = useAccount()
  
  const handleUpdate = (e: React.FormEvent<HTMLInputElement>) => {
    setUpdate(e.currentTarget.value)
  }

  // fetch data for graphql
  const retrieve = gql`
    query fetchUpdates($address: String!) {
      updates(where: {sender: $address}) {
        id
        number
        sender
        timestamp
      }
    }
`;

  
    // Config update
  const { config } = usePrepareContractWrite({
    address: CONTRACT_ADDRESS,
    abi: CONTRACT_ABI,
    functionName: 'store',
    args: [update],
  })

  //
  const {  write } = useContractWrite(config)
  const { isLoading, isSuccess } = useWaitForTransaction({
      // hash: data?.hash,
  })

  // Retrieve 
  const retriveNumber = useContractRead({
    abi: CONTRACT_ABI,
    address: CONTRACT_ADDRESS,
    functionName: 'retrieve',
    chainId: 44787,
  })

  const updateNumber = () => {
    if (!update) {
      return alert("Field required")
    }
    if (!address) return alert("Please connect your wallet")
    if(isSuccess) return alert("Successfully added")
    write?.()
    setUpdate(" ")
  }

    const { loading, error, data } = useQuery(retrieve, {
    variables: { address },
    });
  
  const formatTimestamp = (timeStamp: number) => {
    const date = new Date(timeStamp * 1000)
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    return `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
  }

  return (
    <div>
      <div className="h1 text-2xl text-center font-bold">SUBGRAPH TASK - STORAGE DAPP</div>
      <input className="border w-full p-2 my-4" type="number" placeholder="Update number" value={update} onChange={handleUpdate}/>
      <button onClick={updateNumber} className="bg-yellow-300 p-2 w-full">{`${isLoading ? "Loading..." : "Update Number"}`}</button>
      <div>
        {loading ? "Fetching data..." :
          <div>
            <h1 className="text-2xl font-bold text-center p-4">User Updated List</h1>
            <div className="grid grid-cols-4 font-bold">
              <h1 className="border p-2">Id</h1>
              <h1 className="border p-2">Sender</h1>
              <h1 className="border p-2">Number</h1>
              <h1 className="border p-2">Time Stamp</h1>
            </div>
            {data && data.updates.map((item: any) =>
              <div className="grid grid-cols-4" key={item.id}>
                <p className="border p-2">{item.id.substring(0,10)}</p>
                <p className="border p-2">{item.sender.substring(0,15)}</p>
                <p className="border p-2 text-center">{item.number}</p>
                <p className="border p-2">{formatTimestamp(item.timestamp)}</p>
              </div>
            )}
        </div>
        }
        {error ? error.message : null}
       
     
      </div>
    </div>
  )
}
