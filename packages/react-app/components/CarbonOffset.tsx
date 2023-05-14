import { gql, useQuery } from "@apollo/client";
import ToucanClient from 'toucan-sdk'
import { issueNFT, hasNCT, addressToLowerCase } from '../utils'
import { useProvider, useSigner, useAccount } from 'wagmi'
import Image from 'next/image'
import {parseEther} from "ethers/lib/utils";

const CARBON_OFFSETS = gql`
  query CarbonOffsets {
    tco2Tokens(first: 3) {
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
`

interface CarbonOffsetProps {
  getNftHandler: () => void;
}


const CarbonOffsets: React.FC<CarbonOffsetProps> = ({getNftHandler}) => {

  const provider = useProvider()
  const { data: signer, isError, isLoading } = useSigner()
  const toucan = new ToucanClient('alfajores', provider)
  signer && toucan.setSigner(signer)

  const { address } = useAccount()
  const { loading, error, data } = useQuery(CARBON_OFFSETS)

  const getUserRetirements = async() => {
    return await toucan.fetchUserRetirements(addressToLowerCase(address))
  }

  const redeemPoolToken = async (): Promise<void> => {

    const redeemedTokenAddress = await toucan.redeemAuto2('NCT', parseEther('1'))
    return redeemedTokenAddress[0].address

  }

  const retireTco2Token = async (): Promise<void> => {
    try {
      const tco2Address = await redeemPoolToken()

      return await toucan.retire(parseEther('1'), tco2Address)
    } catch (e) {
      console.log(e)
    }
  }

  const supportProject = async() => {

    const userHasNCT = await hasNCT(address)
    if (userHasNCT) {
      const res = await retireTco2Token()
      return res && (await issueNFTHandler())
    }
    alert('Purchase NCT token first')
  }

  const issueNFTHandler = async () => {

    if (!address) return alert('Connect your Celo wallet')

    const retirements = await getUserRetirements()

    if (retirements) {
      await issueNFT(retirements.length)
      await getNftHandler()
    }
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error! {error.message}</div>

  return (

    <div className="grid grid-cols-3 gap-4 mt-10">
      {data.tco2Tokens.map((carbon: any, i: number) => (
      <div key={i}>
        <div className="bg-white rounded-lg shadow-lg p-4">
          <Image
            src={`/images/${i}.jpg`}
            width={300}
            height={300}
            alt="NFT image"
            className="mx-auto"
          />
          <h2 className="font-bold mb-2">{carbon.name}</h2>
          <button onClick={supportProject} type="button" className="bg-slate-300 w-28 rounded">
            Support
          </button>
        </div>
      </div>
    ))}
  </div>

    // <div className="mt-6 grid grid-cols-1 gap-y-10 gap-x-6 sm:grid-cols-2 lg:grid-cols-4 xl:gap-x-8 clickable-card">
    //   {data.tco2Tokens.map((carbon: any) => (
    //     <div
    //       key={carbon.id}
    //       className="group relative max-w-sm rounded overflow-hidden shadow-lg"
    //     >
    //       <div className="min-h-80 aspect-w-1 aspect-h-1 w-full overflow-hidden rounded-md bg-gray-200 group-hover:opacity-75 lg:aspect-none lg:h-80">
    //         <img src={randomizeImage()} alt={randomizeImage()} />
    //       </div>
    //       <div className="mt-4 flex justify-between pl-4">
    //         <div>
    //           <h3 className="text-bg font-weight-bold text-gray-900">
    //             <a href={`https://celoscan.io/tx/${carbon.creationTx}`}>
    //               <span aria-hidden="true" className="absolute inset-0" />
    //               Name: {carbon.name}
    //             </a>
    //           </h3>
    //           <p className="mt-2 text-sm text-gray-500">
    //             Symbol: {carbon.symbol}
    //           </p>
    //           <p className="mt-2 text-sm font-medium text-gray-900 pr-3">
    //             Score: {carbon.score}
    //           </p>
    //         </div>
    //       </div>
    //       <div className="mt-4 flex pl-4">
    //         <span className="inline-block bg-gray-200 rounded-full mt-2 px-3 py-1 text-sm font-semibold text-gray-700 mr-2 mb-2">
    //           Created At{" "}
    //           {new Date(carbon.createdAt * 1000).toLocaleString("en-GB", {
    //             day: "2-digit",
    //             month: "2-digit",
    //             year: "2-digit",
    //             hour: "numeric",
    //             minute: "numeric",
    //             hour12: false,
    //           })}
    //         </span>
    //       </div>
    //     </div>
    //   ))}
    // </div>
  );
};

export default CarbonOffsets;