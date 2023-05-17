import React, { useState } from 'react';
import Link from 'next/link';
import { gql, useQuery } from '@apollo/client';
import ToucanClient from 'toucan-sdk';

import { BigNumber, Contract, ContractReceipt, ethers } from 'ethers';
import { parseEther } from 'ethers/lib/utils.js';

const GET_TCOTOKENS = gql`
  query CarbonRedeem {
    tco2Tokens {
      symbol
    }
  }
`;

const CarbonRedeem: React.FC = () => {
  const [amount, setAmount] = useState<number>(0);
  const [contractReceipt, setcontractReceipt] = useState<ContractReceipt>();
  const [selectedToken, setSelectedToken] = useState<any>('');
  const { loading, error, data } = useQuery(GET_TCOTOKENS);

  require('dotenv').config();

  const redeemAuto = async () => {
    try {
      const ethereum: any = window;
      if (typeof window.ethereum !== 'undefined') {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        console.log('signer', signer);
        const sdk = new ToucanClient('mumbai');
        sdk.setProvider(provider);
        sdk.setSigner(signer);
        const amountBN = BigNumber.from(amount);
        const contractReceipt = await sdk.redeemAuto(
          selectedToken,
          parseEther(amount.toString())
        );
        console.log(contractReceipt);
        setcontractReceipt(contractReceipt);
      } else {
        // `window.ethereum` is not available, so the user may not have a web3-enabled browser
        console.error(
          'Please install MetaMask or another web3-enabled browser extension'
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTokenSelect = (event: any) => {
    setSelectedToken(event.target.value);
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className='flex items-center mb-3'>
      <label className='block text-gray-700 font-bold mb-2' htmlFor='amount'>
        Amount(minimum value is 1):
      </label>
      <input
        className='shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline'
        id='amount'
        type='text'
        value={amount}
        onChange={(e) => setAmount(Number(e.target.value))}
      />
      <select
        className='bg-gray-100 rounded-none py-2 px-4 mr-2'
        value={selectedToken}
        onChange={handleTokenSelect}
      >
        <option value=''>Select Token</option>
        {data.tco2Tokens.map((token: any) => (
          <option key={token.id} value={token.id}>
            {token.symbol}
          </option>
        ))}
      </select>
      <button style={buttonStyle} onClick={redeemAuto}>
        Redeem
      </button>
      {contractReceipt && (
        <div>
          <Link
            href={`https://alfajores.celoscan.io/tx/${contractReceipt.transactionHash}`}
            target='_blank'
            rel='noopener noreferrer'
            className='text-blue-500 hover:text-blue-700 underline'
          >
            View transaction details {contractReceipt.contractAddress}
          </Link>
        </div>
      )}
    </div>
  );
};

const buttonStyle = {
  backgroundColor: 'black',
  color: '#fff',
  border: 'none',
  borderRadius: '4px',
  padding: '8px 16px',
  cursor: 'pointer'
};

export default CarbonRedeem;
