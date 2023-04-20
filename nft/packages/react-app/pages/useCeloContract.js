import { useState, useEffect, useCallback } from "react";
import { useCelo } from "@celo/react-celo";

export const useContract = (abi, contractAddress) => {
  const { kit, address, connect } = useCelo();
  const [contract, setContract] = useState(null);

  const getContract = useCallback(async () => {
    setContract(new kit.connection.web3.eth.Contract(abi, contractAddress));
  }, [kit, abi, contractAddress]);

  useEffect(() => {
    if (address) getContract();
  }, [address, getContract]);

  return contract;
};
