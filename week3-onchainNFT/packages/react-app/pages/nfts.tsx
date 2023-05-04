import abi from 'utils/abi.json';
import { useSigner } from "wagmi";
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import Image from 'next/image';
export default function Home() {

    interface MyNFT{
        id: number;
        image: string;
    }
    const contractAddress = "0x3c5aD009d2e9f11A06c6ec31377D612C81f6b224";
    const { data: signer, isError, isLoading } = useSigner();
    const [nftList, setNftList] = useState<MyNFT[]>([]);
    

    useEffect(() => {

        const seeAllNfts = async() =>{
            if(signer) {
              const contract = new ethers.Contract(contractAddress, abi, signer);
              const result = await contract.seeNFTs();
              console.log(result)
              setNftList(result);
            }
          } 
	


		if (signer) {
			seeAllNfts();
		}
	}, [signer]);

    return (
      <div>

        <div className=' text-center text-3xl mb-4 font-medium'>ALL NFTS</div>
      
        <div className='grid grid-cols-3 gap-10'>
          {
            nftList?.map((res) =>(
              <div key={res.id}>
                <Image src={res.image} alt='nft' height={300} width={300}/>
              </div>
            ))
          }
          </div>
     
         
  
      </div>
    )
  }
  