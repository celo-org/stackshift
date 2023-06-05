import React from 'react'
import { hexToNumber } from '@/utils/Truncate'

interface IParam {
  voters: any[]
}
export default function VotersList(param: IParam) {
 
  return (
    <div>
        <h1 className='text-lg font-bold mt-4'>{`Voters (${ param.voters && param.voters.length})`}</h1>
        <div className="flex flex-col">
          <div className="overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="inline-block min-w-full py-2 sm:px-6 lg:px-8">
              <div className="overflow-hidden">
                <table className="min-w-full text-left text-sm font-light">
                  <thead className="border-b font-medium dark:border-neutral-500">
                    <tr>
                      <th scope="col" className="px-6 py-4">Address</th>
                      <th scope="col" className="px-6 py-4">Voter Choice</th>
                      <th scope="col" className="px-6 py-4">Voting Power</th>

                    </tr>
                  </thead>
                <tbody>
                    {param.voters && param.voters.map((item : any, index: number) =>
                      <tr key={index} className="border-b dark:border-neutral-500">
                      <td className="whitespace-nowrap px-6 py-4">{item.voterAddress}</td>
                      <td className="whitespace-nowrap px-6 py-4">{hexToNumber(item.voteChoice._hex) === 1 ? "Yes" : "No"}</td>
                        <td className="whitespace-nowrap px-6 py-4 font-medium">1 VOTE</td>

                    </tr>
                    )}
                    {!param.voters &&
                    <tr>
                      <td colSpan={3}>No data available</td>
                    </tr>
                  }
                  </tbody>
                </table>
              </div>
            </div>
        </div>
      </div>
    </div>
  )
}
