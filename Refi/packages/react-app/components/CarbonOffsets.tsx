import React from 'react';
import { gql, useQuery } from '@apollo/client';
import Link from 'next/link';
import randomizeImage from '@/Helpers/RandomImages.tsx';

const CARBON_OFFSETS = gql`
  query CarbonOffsets {
    tco2Tokens(first: 9) {
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

export const CarbonOffset = () => {
  const { loading, error, data } = useQuery(CARBON_OFFSETS);
  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error! {error.message}</div>;
  return (
    <>
      <div className='mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 clickable-card'>
        {data.tco2Tokens.map((carbon: any) => (
          <div
            key={carbon.id}
            className='group relative max-w-sm rounded overflow-hidden shadow-lg'
          >
            <div className='min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80'>
              <img src={randomizeImage()} alt={randomizeImage()} />
            </div>
            <div className='mt-4 flex justify-between pl-4'>
              <div>
                <h3 className='text-bg font-weight-bold text-gray-900'>
                  <Link href={`https://celoscan.io/tx/${carbon.creationTx}`}>
                    <span aria-hidden='true' className='absolute inset-0' />
                    Name: {carbon.name}
                  </Link>
                </h3>
                <p className='mt-2 text-sm text-gray-500'>
                  Symbol: {carbon.symbol}
                </p>
                <p className='mt-2 text-sm font-medium text-gray-900 pr-3'>
                  Score: {carbon.score}
                </p>
              </div>
            </div>
            <div className='mt-4 flex pl-4'>
              <span className='inline-block bg-gray-200 rounded-full mt-2 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2'>
                Created At{' '}
                {new Date(carbon.createdAt * 1000).toLocaleString('en-GB', {
                  day: '2-digit',
                  month: '2-digit',
                  year: '2-digit',
                  hour: 'numeric',
                  minute: 'numeric',
                  hour12: false
                })}
              </span>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};
