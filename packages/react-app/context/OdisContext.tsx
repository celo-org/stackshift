import {
    ACCOUNTS_CONTRACT,
    ACCOUNTS_PROXY_ADDRESS,
    ALFAJORES_CUSD_ADDRESS,
    FA_CONTRACT,
    FA_PROXY_ADDRESS,
    ODIS_PAYMENTS_CONTRACT,
    ODIS_PAYMENTS_PROXY_ADDRESS,
    STABLE_TOKEN_CONTRACT,
    ALFAJORES_RPC,
  } from "../utils/constants";
  import { OdisUtils } from "@celo/identity";
  import {
    AuthenticationMethod,
    OdisContextName,
  } from "@celo/identity/lib/odis/query";
  import { ethers, Wallet } from "ethers";
  import React, { useState, useEffect, useReducer } from "react";
  import { WebBlsBlindingClient } from "../utils/webBlindingClient";
  
  const ISSUER_PRIVATE_KEY =
    "0x726e53db4f0a79dfd63f58b19874896fce3748fcb80874665e0c147369c04a37";
  const DEK_PUBLIC_KEY =
    "0x026063780c81991c032fb4fa7485c6607b7542e048ef85d08516fe5c4482360e4b";
  const DEK_PRIVATE_KEY =
    "0xc2bbdabb440141efed205497a41d5fb6114e0435fd541e368dc628a8e086bfee";
  
  const INITIAL_STATE = {
    issuer: undefined,
    serviceContext: undefined,
    authSigner: undefined,
    federatedAttestationsContract: undefined,
    odisPaymentsContract: undefined,
    accountsContract: undefined,
    stableTokenContract: undefined,
  };
  
  export const OdisContext = React.createContext(INITIAL_STATE);
  
  let ONE_CENT_CUSD = ethers.utils.parseEther("0.01");
  
  const reducer = (state = INITIAL_STATE, action) => {
    switch (action.type) {
      case "ISSUER":
        return { ...state, issuer: action.payload };
      case "FEDERATED_ATTESTATIONS":
        return { ...state, federatedAttestationsContract: action.payload };
      case "ODIS_PAYMENTS":
        return { ...state, odisPaymentsContract: action.payload };
      case "ACCOUNTS":
      return { ...state, accountsContract: action.payload }; 
      case "STATE":
        return { ...state, ...action.payload };
      default:
        return state;
    }
  };
  
  function OdisProvider({ children }) {
    const [isInitialized, setIsInitialized] = useState(false);
    const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  
    useEffect(() => {
      const init = async () => {
        let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
        let issuer = new Wallet(ISSUER_PRIVATE_KEY, provider);
        let serviceContext = OdisUtils.Query.getServiceContext(
          OdisContextName.ALFAJORES
        );
  
        const blindingClient = new WebBlsBlindingClient(
          serviceContext.odisPubKey
        );
        await blindingClient.init();
  
        let authSigner = {
          authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
          rawKey: DEK_PRIVATE_KEY,
        };
  
        let accountsContract = new ethers.Contract(
          ACCOUNTS_PROXY_ADDRESS,
          ACCOUNTS_CONTRACT.abi,
          issuer
        );
        let federatedAttestationsContract = new ethers.Contract(
          FA_PROXY_ADDRESS,
          FA_CONTRACT.abi,
          issuer
        );
        let odisPaymentsContract = new ethers.Contract(
          ODIS_PAYMENTS_PROXY_ADDRESS,
          ODIS_PAYMENTS_CONTRACT.abi,
          issuer
        );
        let stableTokenContract = new ethers.Contract(
            ALFAJORES_CUSD_ADDRESS,
            STABLE_TOKEN_CONTRACT.abi,
            issuer
          );
    
          dispatch({
            type: "STATE",
            payload: {
              issuer,
              serviceContext,
              blindingClient,
              authSigner,
              accountsContract,
              federatedAttestationsContract,
              odisPaymentsContract,
              stableTokenContract,
            },
          });
        };
        init();
      }, []);
    
      return (
        <OdisContext.Provider
          value={{
            issuer: state.issuer,
            serviceContext: state.serviceContext,
            authSigner: state.authSigner,
            accountsContract: state.accountsContract,
            odisPaymentsContract: state.odisPaymentsContract,
            stableTokenContract: state.stableTokenContract,
            federatedAttestationsContract: state.federatedAttestationsContract,
          }}
        >
          {children}
        </OdisContext.Provider>
      );
    }
    
    export default OdisProvider;
    