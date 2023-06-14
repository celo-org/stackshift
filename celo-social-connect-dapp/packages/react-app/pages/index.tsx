import {
  ALFAJORES_CUSD_ADDRESS,
  ALFAJORES_RPC,
  FA_CONTRACT,
  FA_PROXY_ADDRESS,
  ODIS_PAYMENTS_CONTRACT,
  ODIS_PAYMENTS_PROXY_ADDRESS,
  STABLE_TOKEN_CONTRACT,
  ISSUER_PRIVATE_KEY,
  DEK_PRIVATE_KEY
} from "../utils/constants";
import { OdisUtils } from "@celo/identity";
import { AuthenticationMethod, AuthSigner, OdisContextName } from "@celo/identity/lib/odis/query";
import { ethers, Wallet } from "ethers";
import { WebBlsBlindingClient } from "../utils/webBlindingClient";
import { parseEther } from "viem";
import { useSession, signIn, signOut } from "next-auth/react";
import { LockOpenIcon, LockClosedIcon } from "@heroicons/react/24/outline";
import { useAccount, useSendTransaction } from "wagmi";
import { ISocialConnect } from "@/utils/ISocialConnect";

import { useEffect, useState } from "react";


export default function Home() {

  let [sc, setSc] = useState<ISocialConnect>();
  let [phone, setPhone] = useState('')
  const [amount, setAmount] = useState('');

  // step no. 1
  let { address } = useAccount();

  // step no. 2
  let { data: session } = useSession();
  let [socialIdentifier, setSocialIdentifier] = useState("");

  // step no. 3
  // let [identifierToSend, setIdentifierToSend] = useState("");
  let [addressToSend, setAddressToSend] = useState("");

  useEffect(() => {

    let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    let issuer = new Wallet(ISSUER_PRIVATE_KEY!, provider);
    let serviceContext = OdisUtils.Query.getServiceContext(OdisContextName.ALFAJORES);
    let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey);
    let quotaFee = ethers.utils.parseEther("0.01");
    let authSigner: AuthSigner = {
      authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
      rawKey: DEK_PRIVATE_KEY!
    };
    let federatedAttestationsContract = new ethers.Contract(
      FA_PROXY_ADDRESS!,
      FA_CONTRACT.abi,
      issuer
    );
    let odisPaymentsContract = new ethers.Contract(
      ODIS_PAYMENTS_PROXY_ADDRESS!,
      ODIS_PAYMENTS_CONTRACT.abi,
      issuer
    );
    let stableTokenContract = new ethers.Contract(
      ALFAJORES_CUSD_ADDRESS!,
      STABLE_TOKEN_CONTRACT.abi,
      issuer
    );
    let sCVars : ISocialConnect = {
      issuerAddress: issuer.address,
      federatedAttestationsContract,
      odisPaymentsContract,
      stableTokenContract,
      authSigner,
      serviceContext,
      quotaFee,
      blindingClient
    };
    setSc(sCVars);
  }, []);

  // const bigintAmount: bigint = BigInt(amount.toString());
  let { sendTransaction } = useSendTransaction({
    to: addressToSend,
    value: parseEther("1", "wei")
    // value: ethers.utils.parseUnits(amount, 18)
    // value: ethers.utils.parseEther(amount)
  });

  async function checkAndTopUpODISQuota() {
    const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
      sc!.issuerAddress,
      sc!.authSigner,
      sc!.serviceContext
    );
    if (remainingQuota < 1) {
      let currentAllowance = await sc!.stableTokenContract.allowance(
        sc!.issuerAddress,
        sc!.odisPaymentsContract.address
      );
      let enoughAllowance = false;
      if (sc!.quotaFee.gt(currentAllowance)) {
        let approvalTxReceipt = await sc!.stableTokenContract
          .increaseAllowance(
            sc!.odisPaymentsContract.address,
            sc!.quotaFee
          );
        enoughAllowance = approvalTxReceipt.status;
      } else {
        enoughAllowance = true;
      }
      if (enoughAllowance) {
        let odisPayment = await sc!.odisPaymentsContract
          .payInCUSD(
            sc!.issuerAddress,
            sc!.quotaFee
          );
      } else {
        throw "ODIS => cUSD approval failed";
      }
    }
  }
  
  async function getObfuscatedIdentifier(identifier: string) {
    let obfuscatedIdentifier = (
      await OdisUtils.Identifier.getObfuscatedIdentifier(
        identifier,
        OdisUtils.Identifier.IdentifierPrefix.PHONE_NUMBER,
        sc!.issuerAddress,
        sc!.authSigner,
        sc!.serviceContext,
        undefined,
        undefined,
        sc!.blindingClient
      )
    ).obfuscatedIdentifier;
    return obfuscatedIdentifier;
  }

  async function registerAttestation(identifier: string, account: string) {
    // check and top up ODIS quota
    await checkAndTopUpODISQuota();
    let nowTimestamp = Math.floor(new Date().getTime() / 1000);
    let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
    await sc!.federatedAttestationsContract.registerAttestationAsIssuer(
      obfuscatedIdentifier,
      account,
      nowTimestamp
    );
    alert("Address mapped.");
  }

  async function lookupAddress() {
    let obfuscatedIdentifier = getObfuscatedIdentifier(socialIdentifier);
    let attestations = await sc!.federatedAttestationsContract.lookupAttestations(
      obfuscatedIdentifier,
      [sc!.issuerAddress]
    );
    let [latestAddress] = attestations.accounts;
    setAddressToSend(latestAddress);
  }

  async function deregisterIdentifier(identifier: string) {
    try {
      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
      await sc!.federatedAttestationsContract
        .revokeAttestation(obfuscatedIdentifier, sc!.issuerAddress, address);
        alert("Address de-registered.");
    } catch (error) {
      
    }
  }


  return (
    <main>
      <div>
        <div>
          <div>
            <div className=" flex flex-col items-center">
              <h1 className=" text-[4rem] text-center font-bold">TUSH-TIP PROTOCOL</h1>
              <p className=" w-[560px] text-center ">You can now send celo to your friends and family using their phones numbers.
                Tush-Tip Protocol helps us achieve this. All you need to do is register and share
                our product with your loved ones so they can register and get connected to seamless
                transactions.
              </p>
              </div>
          </div>

          <div></div>
        </div>
        {/* registration part */}
          <div>
            <p className=" pt-10 font-semibold text-[20px]">Registration</p>
            <p> (Skip if already registered)</p>
            <form onSubmit={(e) => {
                  e.preventDefault();
                  registerAttestation(
                    phone, address!
                  )
                }
                }
                className=" flex gap-10"
                >
                <input
                type="tel"
                onChange={(e)=>setPhone(e.target.value)}
                placeholder="Enter phone number"
                className=" border-red-300 border-2 py-4 px-2 rounded-lg w-[500px]"
                />

                <button type="submit"
                className=" border-black border-2 px-8  rounded-lg text-[25px]"
                >Register</button>
            </form>

          </div>

          {/* lookup part */}
          <div>
            <p className=" pt-10 font-semibold text-[20px]">Verify Recepient</p>
            <form onSubmit={(e) => {
              e.preventDefault();
              lookupAddress();
            }}
            className=" flex gap-10"
            >
            <input
            type="tel"
            onChange={(e)=>setSocialIdentifier(e.target.value)}
            placeholder="Enter reciever's phone number"
            className="  border-red-300 border-2 py-4 px-2 rounded-lg w-[500px]"
            />

            <button type="submit"
             className=" border-black border-2 px-8  rounded-lg text-[25px]"
            >Search</button>
            </form>

            <div>
              <p className=" pt-10 font-semibold text-[20px]">Send Celo</p>
               <p className=" mb-5 bg-slate-600 text-white py-4 px-2 rounded-lg w-[500px]">Verified recipient address: {addressToSend}</p>
               <form onSubmit={(e) => {
                e.preventDefault();
                sendTransaction();
               }}
               className=" flex ">
               {/* <p  className="  border-red-300 border-2 py-4 px-2 rounded-lg w-[500px]">
                hello
                </p> */}

               <button
               type="submit"
               className=" border-black border-2 px-8  rounded-lg text-[25px] w-[500px]"
               >Send 1 celo</button>
               </form>
            </div>
          </div>
      </div>
   
  </main>
  )
}