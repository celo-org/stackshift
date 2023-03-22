import { useEffect, useState } from 'react'
import { NODE_URL, truncate } from '../utils'
import { newKit } from '@celo/contractkit'

const kit = newKit(NODE_URL)
const AppHeader = () => {

  const [address, setAddress] = useState('')

  const connect = async () => {
    try {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      setAddress(accounts[0])
    } catch (error) {
      console.log(error)
    }
  }

  return (
    <div>
    <nav className=" relative w-full flex flex-wrap items-center justify-between py-4 bg-gray-100 text-gray-500 hover:text-gray-700 focus:text-gray-700 shadow-lg navbar navbar-expand-lg navbar-light">
      <div className="container-fluid w-full flex flex-wrap items-center justify-between px-6">
        <h3>Fund Splitter</h3>

        <div className="flex items-center relative">
          <div className="dropdown relative">
            <span data-bs-toggle="modal" data-bs-target="#nft-form" className="text-gray-500 hover:text-gray-700 focus:text-gray-700 mr-4 dropdown-toggle hidden-arrow flex items-center" id="dropdownMenuButton1" role="button" aria-expanded="false">
              {/*<PlusSmIcon className="w-8 h-8 text-gray-500" />*/}
            </span>
          </div>

          <div className="flex justify-center">
            {address ? <div>
              <div className="dropdown relative">
                <button className=" dropdown-toggle px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap" type="button" id="dropdownMenuButton1" data-bs-toggle="dropdown" aria-expanded="false">
                  {truncate(address)}
                  <svg aria-hidden="true" focusable="false" data-prefix="fas" data-icon="caret-down" className="w-2 ml-2" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                    <path fill="currentColor" d="M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"></path>
                  </svg>
                </button>
                <ul className="dropdown-menu min-w-max absolute hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded-lg shadow-lg mt-1 hidden m-0 bg-clip-padding border-none" aria-labelledby="dropdownMenuButton1">
                  <li>
                    <span className="dropdown-item text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-gray-700 hover:bg-gray-100">Disconnect</span>
                  </li>
                </ul>
              </div>
            </div> :
              <button onClick={connect} className=" dropdown-toggle px-6 py-2.5 bg-blue-600 text-white font-medium text-xs leading-tight uppercase rounded shadow-md hover:bg-blue-700 hover:shadow-lg focus:bg-blue-700 focus:shadow-lg focus:outline-none focus:ring-0 active:bg-blue-800 active:shadow-lg active:text-white transition duration-150 ease-in-out flex items-center whitespace-nowrap" type="button" aria-expanded="false">
                Connect
              </button>}
          </div>
        </div>
      </div>
    </nav>
    </div>
  )
}

export default AppHeader