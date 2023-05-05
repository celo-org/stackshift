import abi from 'utils/abi.json';
import tokenAbi from 'utils/tokenAbi.json';
import { useSigner } from "wagmi";
import { Signer, ethers } from 'ethers';
import React, { useState, useEffect } from 'react';
export default function Actions() {
    interface Item{
        itemId: number;
        rewardTitle: string;
        rewardValue: number;
        price: number;
        currentBid: number;
        startTime: number;
        endTime: number;
        withdrawn: boolean;
        seller: string;

    }

    const contractAddress = "0x5110ad25d8c731CCB9F4883285CA8d8f43942f1d"
    const cusdContractAddress = '0x874069fa1eb16d44d622f2e0ca25eea172369bc1';
    const [result, setResult] = useState<Item[]>([]);
    const { data: signer, isError, isLoading } = useSigner();
    const [showBidModal, setShowBidModdal] = useState(false);
    const [showWithdraw, setShowWithdraw] = useState(false);
    const [showWithdrawProceed, setShowWithdrawProceed] = useState(false);
    const [id, setId] = useState('');
    const [amount, setAmount] = useState('');

    const bid = async () => {   
        if(signer){
             // first approve before bidding
          const cusdContract = new ethers.Contract(cusdContractAddress,tokenAbi, signer);
          const approval = await cusdContract.approve(contractAddress, amount);
          alert("Approving, please wait.")
          await approval.wait();
          alert('approved! Wait to bid immediately');
        
          // Implement the bid function
          const contract = new ethers.Contract(contractAddress, abi, signer);
          const bid = await contract.bid(id,amount);
          await bid.wait();
          alert(` Done: ${bid.hash}`);
    
        }  
        else{
            alert("Please connect wallet to bid");
        } 
    
      }
    

    const withdrawBid = async () => {   
        if(signer){
            const contract = new ethers.Contract(contractAddress, abi, signer);
            const withdrawal = await contract.withdrawBid(id);
            alert("Mining in progress, please wait");
            await withdrawal.wait();
            alert("Done! Best of luck next time")
    
        } else{
            alert("Please connect wallet to withdraw bid");
        }     
    
      }


        //   withdraw bid proceed
        const withdrawBidProceed = async () => {

            if(signer){
                // Implement the withdraw proceed function
     
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const withdrawal = await contract.withdrawAuctionProceed(id);
                alert("Mining in progress, please wait");
                await withdrawal.wait();
                alert("Done! Congratulation!!!");
        
            } else{
                alert("Please connect wallet to withdraw proceed");
            }
        
        }
        
        
          



    useEffect(() => {
        const see = async() => {
            if(signer) {
                const contract = new ethers.Contract(contractAddress, abi, signer);
                const seeItems = await contract.seeItems();
                setResult(seeItems);
              
            }else{
                alert("Please connect wallet to see items");
            }
        }

		if (signer) {
			see();
		}
	}, [signer]);

    const date = (timeStamp:number) => {
        let dateFormat = new Date(timeStamp);
        return (dateFormat.getDate()+
        '/' + (dateFormat.getMonth()+1)+
        '/' + dateFormat.getFullYear()+
        ' ' + dateFormat.getHours()+
        ':' + dateFormat.getMinutes()+
        ':' + dateFormat.getSeconds()
        );

    }
   

    return(
        <>
        <div className='grid grid-cols-3 gap-10'>
            {
                result?.map((res) =>(
                    <div className=' border-black border-2 rounded-xl px-1' key={res.itemId}>
                        <p className=' text-xl font-bold'>Item ID: {(res.itemId).toString()}</p>
                        <p className=' font-semibold'>Rwd Det: {res.rewardTitle}</p>
                        <p>Rwd Val: {((res.rewardValue)/1e18).toString()} $NwizuGold</p>
                        <p>Set price: {((res.price)/1e18).toString()} $cUSD</p>
                        <p>Current bid: {((res.currentBid)/1e18).toString()} $cUSD</p>
                        <p>Starting: {(date(res.startTime * 1000))}</p>
                        <p>Ending: {(date(res.endTime * 1000))}</p>
                        {(res.withdrawn) ? <p>Withdrawn: <span className=' bg-green-400 px-2 py-1 text-white rounded-full'>Yes</span></p> : <p> Withdrawn: <span className=' bg-red-500 px-2 py-1 text-white rounded-full'>No</span></p>}
                        <button className=' block border-black rounded-md border-2 text-center px-4' onClick={()=> setShowBidModdal(true)}>Bid</button>
                        <button className=' block border-black rounded-md border-2 text-center px-4 my-2'  onClick={()=> setShowWithdraw(true)}>Withdraw Bid</button>
                        {(res.endTime *1000 < Date.now()) ? <button className=' block border-black rounded-md border-2 text-center px-4 my-2' onClick={()=> setShowWithdrawProceed(true)}>Withdraw Auction Proceed</button>: null}
                        {(res.startTime *1000 > Date.now()) ? <p className=' bg-yellow-300 text-center rounded-full text-white font-bold mb-2'> Auction yet to start</p> :((res.startTime*1000 < Date.now()) && (res.endTime*1000 > Date.now()))?<p className='bg-green-400 text-center rounded-full text-white font-bold mb-2'>Auction is ongoing</p> :<p className='bg-red-500 text-center rounded-full text-white font-bold mb-2'>auctions ended</p>}
                    </div>
                ))
            }
        </div>
        {
            showBidModal? (
                <div className='fixed inset-0 bg-slate-300 bg-opacity-25 backdrop-blur-sm flex justify-center items-center text-white'>
                    <div className='bg-black lg:w-[600px] rounded-md z-10'>
                    <div className='flex justify-end'>
                    <span onClick={()=> setShowBidModdal(false)} className='block mr-5 cursor-pointer mb-6 mt-2 border-white border-2 rounded-full'>X</span>
                    </div>
                    <div className='text-2xl flex justify-center font-semibold mb-3'>BID FOR ITEM</div>
                      <div className='flex justify-center'>
                        <input onChange={(e)=>setId(e.target.value)} className='rounded-md text-center border-black border-2 w-full mx-[8%] py-2 text-black' type='number' placeholder='Item ID' />
                        <input onChange={(e)=>setAmount(e.target.value)} className='rounded-md text-center border-black border-2 w-full mx-[8%] py-2 text-black' type='number' placeholder='Amount($cUSD)' />
                      </div>
                      <div className='flex justify-center'>
                        <button onClick={bid} className=' block border-white border-2 w-full mx-[8%] py-2 text-center mt-3 font-bold text-xl mb-10'>Bid</button>
                      </div>

                      <p className=' text-center italic'>Bid your best. You cannot bid lesser than current bid</p>
            
                    </div>

                </div>
            ) : null
        }

        {/* withdraw bid modal */}
        {
            showWithdraw? (
                <div className='fixed inset-0 bg-slate-300 bg-opacity-25 backdrop-blur-sm flex justify-center items-center text-white'>
                    <div className='bg-black lg:w-[600px] rounded-md z-10'>
                    <div className='flex justify-end'>
                    <span onClick={()=> setShowWithdraw(false)} className='block mr-5 cursor-pointer mb-6 mt-2 border-white border-2 rounded-full'>X</span>
                    </div>
                    <div className='text-2xl flex justify-center font-semibold mb-3'>WITHDRAW YOUR BID</div>
                      <div className='flex justify-center'>
                        <input onChange={(e)=>setId(e.target.value)} className='rounded-md text-center border-black border-2 w-full mx-[8%] py-2 text-black' type='number' placeholder='Item ID' />
                      </div>
                      <div className='flex justify-center'>
                        <button onClick={withdrawBid} className=' block border-white border-2 w-full mx-[8%] py-2 text-center mt-3 font-bold text-xl mb-10'>Withdraw Bid</button>
                      </div>
                     <p className=' text-center italic'>Better luck next time</p>
            
                    </div>

                </div>
            ) : null
        }


        {/* withdraw bid modal */}
        {
            showWithdrawProceed? (
                <div className='fixed inset-0 bg-slate-300 bg-opacity-25 backdrop-blur-sm flex justify-center items-center text-white'>
                    <div className='bg-black lg:w-[600px] rounded-md z-10'>
                    <div className='flex justify-end'>
                    <span onClick={()=> setShowWithdrawProceed(false)} className='block mr-5 cursor-pointer mb-6 mt-2 border-white border-2 rounded-full'>X</span>
                    </div>
                    <div className='text-2xl flex justify-center font-semibold mb-3'>WITHDRAW YOUR AUCTION PROCEED</div>
                      <div className='flex justify-center'>
                        <input onChange={(e)=>setId(e.target.value)} className='rounded-md text-center border-black border-2 w-full mx-[8%] py-2 text-black' type='number' placeholder='Item ID' />
                      </div>
                      <div className='flex justify-center'>
                        <button onClick={withdrawBidProceed} className=' block border-white border-2 w-full mx-[8%] py-2 text-center mt-3 font-bold text-xl mb-10'>Withdraw Proceed</button>
                      </div>
                     <p className=' text-center italic'>You did it. Congratulations!!!</p>
            
                    </div>

                </div>
            ) : null
        }



        </>
    )
}