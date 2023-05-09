import React, { useCallback , useEffect, useState} from 'react'
import axios from 'axios';
import { gql, useQuery } from "@apollo/client";
import Image from 'next/image';
import ToucanClient from 'toucan-sdk';
import { BigNumber, Contract, ContractReceipt, ethers } from 'ethers';
import { PoolSymbol } from 'toucan-sdk/dist/types';
import RedeemModal from './RedeemModal';
import { useAccount } from 'wagmi';

export default function CarbonOffset() {
  const [images, setImages] = useState<any[]>([])
  const [contractReceipt, setcontractReceipt] = useState<ContractReceipt>()
  const [show, setShow] = useState<boolean>(false)
  const { address } = useAccount()
  const CARBON_OFFSETS = gql`
  query CarbonOffsets {
    tco2Tokens(first: 12) {
      name
      symbol
      score
      createdAt
      creationTx
      creator {
        id
      }
    }
  }
`;
  
  const redeemAuto = async (selectedToken: PoolSymbol, amount: string) => {
  try {
    const ethereum: any = window.ethereum;
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(ethereum);
      const signer = provider.getSigner();
      console.log("signer", signer);
      const sdk = new ToucanClient("alfajores");
      sdk.setProvider(provider);
      sdk.setSigner(signer);
      const amountBN = BigNumber.from(amount);
      const contractReceipt = await sdk.redeemAuto(
        selectedToken,
        ethers.utils.parseEther(amount.toString())
      );
      console.log(contractReceipt);
      setcontractReceipt(contractReceipt);
    } else {
      // `window.ethereum` is not available, so the user may not have a web3-enabled browser
      console.error(
        "Please install MetaMask or another web3-enabled browser extension"
      );
    }
  } catch (error) {
    console.error(error);
  }
  };
  
  const handleShowModal = () => {
    setShow(true)
  }

  const handleHideModal = () => {
    setShow(false)
  }
  
   const getImages = useCallback(async ()  => {
     const response = await axios.get(`https://pixabay.com/api/?key=${process.env.NEXT_PUBLIC_IMAGE_KEY}&q=nature&image_type=photo`)
     setImages(response.data.hits)
   }, [])
  
  const fetchResult = async () => {
    const sdk = new ToucanClient("alfajores");
    const tokens = await sdk.fetchAllTCO2Tokens()
    const poolContents = await sdk.fetchPoolContents("BCT")

    const result = await sdk.fetchUserRedeems(address as string, "BCT")
    const retire = await sdk.fetchUserRetirements(address as string)

    console.log(poolContents)
    return(poolContents)

  }
  useEffect(() => {
    getImages()
    fetchResult()
  },[getImages])
  
  const { loading, error, data } = useQuery(CARBON_OFFSETS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;

 
  
  return (
    <div className='grid grid-cols-4'>
      {data && data.tco2Tokens.map((item: any, index: number) => <div key={index}>
        <div className="drop-shadow-md bg-white m-2 p-4 cursor:pointer">
           {images && <Image className='w-full' key={index} src={images[index].webformatURL} alt='images' height={200} width={200}/> } 
          {item.name}
          <button
              // onClick={() => setShow(true)}
              type="button"
              className="inline-block bg-yellow-500 p-2 my-2 w-full rounded  px-6 pb-2 pt-2.5 text-xs font-medium uppercase leading-normal text-white shadow-[0_4px_9px_-4px_#3b71ca] transition duration-150 ease-in-out hover:bg-primary-600 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-primary-600 focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:outline-none focus:ring-0 active:bg-primary-700 active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] dark:shadow-[0_4px_9px_-4px_rgba(59,113,202,0.5)] dark:hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:focus:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)] dark:active:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.2),0_4px_18px_0_rgba(59,113,202,0.1)]"
              data-te-toggle="modal"
              data-te-target="#redeemModal"
              data-te-ripple-init
              data-te-ripple-color="light">
              Redeem
          </button>
                <RedeemModal show={show}  onHide={handleHideModal}/>

          {/* <button onClick={() => redeemAuto(item.symbol, amount)} className='block bg-yellow-500 p-2 my-2 w-full rounded'>Redeem </button> */}
        </div> 
      </div>
      )}

    </div>
  )
}


