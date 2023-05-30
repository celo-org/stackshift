import { gql, useQuery } from "@apollo/client";
import Link from "next/link";
import ToucanClient from "toucan-sdk";
import { BigNumber, Contract, ContractReceipt, Signer, ethers } from "ethers";
import { parseEther } from "ethers/lib/utils.js";
import { useState } from "react";
import { useProvider, useSigner } from "wagmi";




const CarbonOffsets = () => {
    const GET_TCOTOKENS = gql`
  query CarbonRedeem {
    tco2Tokens (first: 9) {
      id
      name
      symbol
    }
  }
`;


    const { loading, error, data } = useQuery(GET_TCOTOKENS);
    const [contractReceipt, setcontractReceipt] = useState<ContractReceipt>();
    const [selectedToken, setSelectedToken] = useState<any>("");
    const [showSubmit, setShowSubmit] = useState(false);

    const provider = useProvider();
    const { data: signer, isError, isLoading } = useSigner();
    const sdk = new ToucanClient("alfajores", provider);
    signer && sdk.setSigner(signer);
   
 
    // require("dotenv").config();

  
    const redeemAuto = async () => {
      try {
        const amount = 2;
        // const token = selectedToken.toHexString();

          const amountBN = BigNumber.from(amount);
          const contractReceipt = await sdk.redeemAuto(
            selectedToken,
            parseEther(amount.toString())
          );
          console.log(contractReceipt);
          setcontractReceipt(contractReceipt);
          setShowSubmit(true);
        } 
       catch (error) {
        console.error(error);
      }
    };

    //your custom code
    const randomizeImage = () => {
        const id = Math.random();
        return `https://picsum.photos/200?random=${id}`;
      };

      if (loading) return <div>Loading...</div>;
      if (error) return <div>Error! {error.message}</div>;
return(
    <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-3 xl:gap-x-8 clickable-card">
  {data.tco2Tokens.map((carbon: any) => (
    <div
      key={carbon.id}
      className="group relative max-w-sm rounded overflow-hidden shadow-lg"
    >
      <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
        <img src={randomizeImage()}  alt={randomizeImage()} />
      </div>
      <div className="mt-4 flex justify-between pl-4">
        <div>
          <p className="mt-2 text-sm text-gray-500 font-bold">Symbol: {carbon.symbol}</p>
          <p className="mt-2 text-[13px] text-gray-500 font-bold">Id: {carbon.id}</p>
          <div>
            <input
            onChange={(e)=>setSelectedToken(e.target.value)}
            className=" block w-full border-red-400 border-2 rounded-md py-2"
            type="text"
            placeholder="enter symbol"
            />
            <button
            onClick={redeemAuto}
            className="block w-[60%] border-2 bg-green-700 py-2 rounded-lg text-white mt-2"
            >Redeem</button>
          </div>
        
          {    showSubmit &&( contractReceipt&&(
              <div className=" z-50 fixed inset-0 flex justify-center">
                 <div className=" mm:w-[70%] px-[87.5px] bg-[#F2F6FF] lg:w-[592px] lg:h-[644px] rounded-[32px]">
                     <div onClick={()=>setShowSubmit(false)} className=" cursor-pointer text-[20.4px] font-bold mt-[76.5px] flex justify-end">X</div>
                        <div className="flex justify-center items-center">
                            <div className=" w-[192px] h-[272px] flex flex-col items-end">
                                <div className=" h-[192px] w-[192px]"></div>
                                    <div className="text-center">
                                        <p className=" font-bold text-[24px] leading-[28.8px]">Success</p>
                                        <div>
                                        <Link
                                            href={`https://alfajores.celoscan.io/tx/${contractReceipt.transactionHash}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="text-blue-500 hover:text-blue-700 underline"
                                        >
                                            View transaction details
                                        </Link>
                                        </div>
                                     </div>     
                                </div>
                             </div>
                        </div>
                    </div>
         ))}
          
        </div>
      </div>
    </div>
  ))}
</div>
);
    
  }

  export default CarbonOffsets