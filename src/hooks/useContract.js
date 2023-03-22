
import { useState, useEffect, useCallback } from 'react'
import { ethers } from 'ethers'

export const useContract = (abi, contractAddress, provider) => {

  const [contract, setContract] = useState(null)

  const getContract = useCallback(async () => {

    const contract = new ethers.Contract(contractAddress, abi, provider);

    setContract(contract)
  }, [abi, contractAddress, provider])

  useEffect(() => {
    getContract()
  }, [getContract])

  return contract
}

