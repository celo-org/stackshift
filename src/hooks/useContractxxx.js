
import { useState, useEffect, useCallback } from 'react'
const Web3 = require('web3')
const ContractKit = require('@celo/contractkit')
const web3 = new Web3(`https://alfajores-forno.celo-testnet.org`)
const kit = ContractKit.newKitFromWeb3(web3)


export const useContract = (abi, contractAddress) => {

  const { kit, address } = useCelo()
  const [contract, setContract] = useState(null)

  const getContract = useCallback(async () => {

    setContract(new kit.connection.web3.eth.Contract(abi, contractAddress))
  }, [kit, abi, contractAddress])

  useEffect(() => {
    if (address) getContract()
  }, [address, getContract])

  return contract
}

