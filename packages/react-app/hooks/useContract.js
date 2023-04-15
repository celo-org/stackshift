
import { useState, useEffect, useCallback } from 'react'
import { useAccount, useContract } from 'wagmi'


export const useMyContract = (abi, contractAddress) => {

  const [contract, setContract] = useState(null)
  const { address, isConnecting, isDisconnected } = useAccount()
  console.log('addr ', address)
  const getContract = useCallback(async () => {
    const contract = useContract({
      address: contractAddress,
      abi,
    })

    setContract(contract)
  }, [abi, contractAddress])

  useEffect(() => {
    if (address) getContract()
  }, [address, getContract])

  return contract
}

