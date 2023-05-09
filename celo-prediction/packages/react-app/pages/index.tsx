import Image from "next/image";
import warrior1 from "../public/prediction3.jpeg";
import warrior2 from "../public/prediction2.jpeg";
import abi from "utils/abimain.json";
import { useEffect, useState } from "react";
import { useSigner } from "wagmi";
import { ethers, Contract } from "ethers";
import { WrapperBuilder } from "redstone-evm-connector";

export default function Home() {
  // @redstone-finance/evm-connector
  // contract addressmain =  0xc4F5000157565ccd102598042Ba70C5C21B2B949
  // authorized main = 0x0C39486f770B26F5527BBBf942726537986Cd7eb
  const { data: signer, isError, isLoading } = useSigner();
  interface Item{
    id: number;
    signer: string;
    choice: number;
    won: boolean;
    amountWon: number;
}

const contractAddress = "0xc4F5000157565ccd102598042Ba70C5C21B2B949"
const [result, setResult] = useState<Item[]>([]);
const [id, setId] = useState('');

async function getContract() {
  let contract;

  try {
    const { ethereum } = window;
    if (ethereum) {
      const provider = new ethers.providers.Web3Provider(ethereum as any);
      const signer = provider.getSigner();

      console.log(signer);
      contract = new Contract(contractAddress, abi, signer);
    }
  } catch (error) {
    console.log("ERROR:", error);
  }
  return contract;
}

const history = async() => {
  const contract = await getContract();
  if(contract){
    const seeHistory = await contract.bettingHistory();
    setResult(seeHistory);
    console.log(seeHistory);
  }
}

const predict = async() => {
  try{
  const contract = await getContract();
  if(contract) {
    const wrappedContract = WrapperBuilder.wrapLite(
      contract
    ).usingPriceFeed("redstone", { asset: "ENTROPY" });

    const predict = await wrappedContract.predict(id,{
      value: ethers.utils.parseEther("0.2")
    });
  
    // value: ethers.utils.parseEther("2"),
    alert("predicting: please wait");
    await predict.wait();
    alert(`Done: ${predict.hash}`);
  }} catch(error) {
    alert("failed");
  }
}

// UseEffect to automatically fetch history
useEffect(() => {
  if(signer) {
    history();
  }

}, [result]);


  return (
    <>
    <div className=" flex justify-between lg:w-[1200px]">
      <div className="flex gap-4 border-black border-2 p-10 rounded-lg">
        <div>
          <span className="block text-center font-bold text-2xl mb-2">0</span>
          <Image src={warrior1} alt="warrior 1" width={188}/>
        </div>
        <div className="flex items-center">
          <span className="  border-black border-2 p-3 rounded-xl">VS</span>
        </div>
        <div>
          <span className="block text-center font-bold text-2xl mb-2">1</span>
          <Image src={warrior2} alt="warrior 2"  width={202}/>
        </div>
      </div>
      <div className="flex items-center">
        <div className="lg:w-[600px] bg-black text-white py-24 rounded-xl drop-shadow-[0_20px_20px_rgba(0,0,0,0.5)]">
          <span className=" block text-center text-2xl font-bold my-6">Prediction</span>
          <span className=" block text-center text-lg italic font-small my-6">(Use the number on each warrior to predict winner)</span>
          <div className=" flex flex-col items-center justify-center">
            <input onChange={(e)=>setId(e.target.value)} className="w-[90%] py-4 rounded-lg px-5 text-black" type="number" placeholder="Enter warrior ID"/>
            <button onClick={predict} className=" mt-5 py-4 border-white border-2 w-[90%] rounded-md text-xl font-bold">Predict</button>
          </div>
          
        </div>
      </div>
    </div>

    <div className=" ">
      <span className="block text-center mt-24 text-2xl font-bold mb-5">Betting History</span>
      {
       result?.map((res) => (
        <div className=" flex justify-around items-start border-2 border-black" key={res.id}>
          <p> Bet ID: {(res.id).toString()}</p>
          <p className="text-left"> {res.signer}</p>
          <p> Choice:{(res.choice).toString()}</p>
          {res.won? <p className=" bg-green-800 text-white p-1">Won</p> : < p className=" bg-red-800 text-white p-1">Lost</p>}
          <p>{((res.amountWon)/1e18).toString()} CELO</p>
        </div>
       )) 
      }
    </div>
    </>
  )
}
