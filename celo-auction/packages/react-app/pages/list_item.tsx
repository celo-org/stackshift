import abi from 'utils/abi.json';
import { useSigner } from "wagmi";
import { ethers } from 'ethers';
import { useState } from 'react';
export default function List_Item() {

 
    const contractAddress = "0x5110ad25d8c731CCB9F4883285CA8d8f43942f1d"
    const { data: signer, isError, isLoading } = useSigner();
    const [title, setTitle] = useState('');
    const [rewardTitle, setRewardTitle] = useState('');
    const [reward, setReward] = useState('');
    const [price, setPrice] = useState('');
    const [start, setStart] = useState('');
    const [end, setEnd] = useState('');

    const list = async () => {
                
    if(signer) {
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const listItem = await contract.listItem(title,rewardTitle,reward,price,start,end);
            alert('Listing item, please wait');
            await listItem.wait();
            alert('Item listed successfully');
        }else{
            alert( "Make sure your wallet is connected and fill every detail")
        }
        
}
   
    


    return (
      <div>
        <div className=' text-center text-3xl mb-4 font-medium'>LIST ITEM</div>
        <div className=" flex flex-col lg:w-[600px]">
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='text' placeholder='Item title'  onChange={(e)=>{setTitle(e.target.value)}}/>
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='text' placeholder='Item reward title(eg. Get 200 $NwizuGold)' onChange={(e)=>{setRewardTitle(e.target.value)}}/>
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='number' placeholder='Item reward value in ($NwizuGold)' onChange={(e)=>{setReward(e.target.value)}}/>
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='number' placeholder='Price in(cusd)' onChange={(e)=>{setPrice(e.target.value)}}/>
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='number' placeholder='Start time in minutes' onChange={(e)=>{setStart(e.target.value)}}/>
                <input className=' my-4 py-3 bg-transparent border-black border-2 rounded-lg px-4' type='number' placeholder='End time in minutes' onChange={(e)=>{setEnd(e.target.value)}}/>
                <button className=' my-4 py-3 bg-yellow-200 border-black border-2 rounded-lg px-4 text-xl font-medium tracking-widest' onClick={list}>List</button>
            </div>

      
         
      </div>
    )
  }
  