import { ethers } from "ethers";
import { AuthSigner } from "@celo/identity/lib/odis/query";
import { WebBlsBlindingClient } from "./webBlindingClient";

interface ServiceContext {
  odisUrl: string;
  odisPubKey: string;
}

export interface ISocialConnect {
  
  children?: React.ReactNode;

  // General
  issuerAddress: string;
  authSigner: AuthSigner;
  serviceContext: ServiceContext;
  quotaFee: ethers.BigNumber;
  blindingClient: WebBlsBlindingClient;

  // Contracts
  federatedAttestationsContract: ethers.Contract;
  odisPaymentsContract: ethers.Contract;
  stableTokenContract: ethers.Contract;
  
}