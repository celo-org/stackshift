import React, {useEffect, useState} from 'react'
import { useParams } from 'react-router-dom';
import SupportersForm from './SupportersForm'
import { useQuery } from '@tanstack/react-query' 
import { getCreators } from '../../utils/interact';

interface IParams {
  id: number;
  username: string;
  ipfsHash: string;
  userbio: string;
  walletAddress: string;
}

export default function ProfilePage() {
  let { username } = useParams();
  const [data, setData] = useState<any>({})
  
  useEffect(() => {
    const creatorData = async () => {
      const creators = await getCreators()
     return setData(creators.find(item => item.username === username))
    }
    creatorData()
  }, [])
  
  console.log(data.id)

  return (
    <div>
      {data !== undefined ?
       <div className='p-28'>
          <div className='flex px-48 pb-8'>          
            <img className='rounded-full' src={`https://ipfs.io/ipfs/${ data && data.ipfsHash}`} width="100px" alt="profile-pix" />
            <div className='m-4'>
              <p className='text-xl'>{`Hi ${ data && data.username}`}</p>
              <p> { data && data.userbio}</p>
            </div>
          </div>
          <div>
        </div>
        <SupportersForm id={ data && data.id -1} walletAddress={data &&  data.walletAddress} />
    </div>
       : <div className='text-center p-60 text-2xl'>Loading data ...</div>}
      
    </div>
    
  )
}
