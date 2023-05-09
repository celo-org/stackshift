import React, { useEffect, useState } from 'react';
import redstone from 'redstone-api';

interface RedstoneData {
  value: number;
  timestamp: number;
  provider: string;
  permawebTx: string;
  source: Record<string, number>;
}

const Card = () => {
  const [inputTokenId, setInputTokenId] = useState('BTC');
  const [redstoneData, setRedstoneData] = useState<RedstoneData | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const redstoneData: RedstoneData = await redstone.getPrice(inputTokenId);
        console.log(redstoneData);
        setRedstoneData(redstoneData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [inputTokenId]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setInputTokenId(event.target.value);
  };

  return (
    <div className="">
      <div>
        <h1 className='font-bold text-2xl'>Get Token Price Across Platforms 
        </h1>
        <input className='w-full p-3 mt-4' type="text" value={inputTokenId} onChange={handleInputChange} />
        <p className='text-xs'>Input your token, e.g, ETH, BTC, SOL, AR, etc</p>
        <p className='mb-3 text-xs text-red-600 underline'><a href="http://" target="_blank" rel="noopener noreferrer">* Link to Token Names to test with</a></p>
      </div>
      <div className='bg-white rounded-sm p-3 my-4'>
      <p><span className='font-semibold'>Token Name:</span> {redstoneData.symbol}</p>
        <p><span className='font-semibold'>Token Price:</span> {`$${redstoneData.value.toFixed(2)}`}</p>
      </div>
      <div className="">
        
        {redstoneData ? (
          <>
            <ul className=''>
              {Object.entries(redstoneData.source).map(([source, value]) => (
                <li className='list-disc bg-white rounded-sm p-3 my-3 capitalize' key={source}>
                  {source}: ${value}
                </li>
              ))}
            </ul>
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
};

export default Card;
