// import {
//   ALFAJORES_CUSD_ADDRESS,
//   ALFAJORES_RPC,
//   FA_CONTRACT,
//   FA_PROXY_ADDRESS,
//   ODIS_PAYMENTS_CONTRACT,
//   ODIS_PAYMENTS_PROXY_ADDRESS,
//   STABLE_TOKEN_CONTRACT,
//   ISSUER_PRIVATE_KEY,
//   DEK_PRIVATE_KEY,
// } from "./../utils/constants";

import SearchBar from "../components/SearchBar";

// import { OdisUtils } from "@celo/identity";
// import {
//   AuthenticationMethod,
//   AuthSigner,
//   OdisContextName,
// } from "@celo/identity/lib/odis/query";
// import { ethers, Wallet } from "ethers";
// import { WebBlsBlindingClient } from "../utils/webBlindingClient";
// import React, { use, useEffect, useState } from "react";
// import { useAccount, useSendTransaction } from "wagmi";
// import { ISocialConnect } from "../utils/ISocialConnect"
// import { useIsMounted } from "../hooks/useIsMounted"


export default function Home() {

//   let isMounted = useIsMounted();
//   let [sc, setSc] = useState<ISocialConnect>();
//   let { address } = useAccount();
  
//   const [processing, setProcessing] = useState(false);
//   let [phoneNumber, setPhoneNumber] = useState("");
//   let [socialIdentifier, setSocialIdentifier] = useState("");
//   let [identifierToSend, setIdentifierToSend] = useState("");
//   let [addressToSend, setAddressToSend] = useState("");
//   const [resolvedAccount, setResolvedAccount] = useState("");

//   useEffect(() => {
//     if (sc) {
//       setTimeout(() => {
//         lookupAddress();
//       }, 300);
//     }
//   }, [sc]);

//   useEffect(() => {
//     let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
//     let issuer = new Wallet(ISSUER_PRIVATE_KEY!, provider);
//     let serviceContext = OdisUtils.Query.getServiceContext(
//       OdisContextName.ALFAJORES
//     );
//     let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey);
//     let quotaFee = ethers.utils.parseEther("0.01");
//     let authSigner: AuthSigner = {
//       authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
//       rawKey: DEK_PRIVATE_KEY!,
//     };
//     let federatedAttestationsContract = new ethers.Contract(
//       FA_PROXY_ADDRESS!,
//       FA_CONTRACT.abi,
//       issuer
//     );
//     let odisPaymentsContract = new ethers.Contract(
//       ODIS_PAYMENTS_PROXY_ADDRESS!,
//       ODIS_PAYMENTS_CONTRACT.abi,
//       issuer
//     );
//     let stableTokenContract = new ethers.Contract(
//       ALFAJORES_CUSD_ADDRESS!,
//       STABLE_TOKEN_CONTRACT.abi,
//       issuer
//     );
//     let sCVars: ISocialConnect = {
//       issuerAddress: issuer.address,
//       federatedAttestationsContract,
//       odisPaymentsContract,
//       stableTokenContract,
//       authSigner,
//       serviceContext,
//       quotaFee,
//       blindingClient,
//     };
//     setSc(sCVars);
//   }, []);


//   async function getObfuscatedIdentifier(identifier: string) {
//     let obfuscatedIdentifier = (
//       await OdisUtils.Identifier.getObfuscatedIdentifier(
//         identifier,
//         OdisUtils.Identifier.IdentifierPrefix.TWITTER,
//         sc!.issuerAddress,
//         sc!.authSigner,
//         sc!.serviceContext,
//         undefined,
//         undefined,
//         sc!.blindingClient
//       )
//     ).obfuscatedIdentifier;
//     return obfuscatedIdentifier;
//   }

//   async function lookupAddress() {
//     let obfuscatedIdentifier = getObfuscatedIdentifier(
//       user.username.toLowerCase()
//     );
//     let attestations =
//       await sc!.federatedAttestationsContract.lookupAttestations(
//         obfuscatedIdentifier,
//         [sc!.issuerAddress]
//       );
//     let [latestAddress] = attestations.accounts;
//     if (!latestAddress) {
//       alert("Error, No address found for this user");
//     }
//     setAddressToSend(latestAddress);
//   }

//   async function registerAttestation(identifier: string, account: string) {
//     try {
//       setProcessing(true);

//       if (!user?.providerId || !address) {
//         alert("Error, Please login first.");
//         return;
//       }

//       // check and top up ODIS quota
//       await checkAndTopUpODISQuota();
//       let nowTimestamp = Math.floor(new Date().getTime() / 1000);
//       let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
//       await sc!.federatedAttestationsContract.registerAttestationAsIssuer(
//         obfuscatedIdentifier,
//         account,
//         nowTimestamp
//       );
//       alert("Success, Address mapped.");
//     } catch (e) {
//       alert("Error, Error mapping address.");
//     } finally {
//       setProcessing(false);
//     }
//   }

//   async function checkAndTopUpODISQuota() {
//     const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
//       sc!.issuerAddress,
//       sc!.authSigner,
//       sc!.serviceContext
//     );
//     // console.log("remainingQuota", { remainingQuota });
//     if (remainingQuota < 1) {
//       let currentAllowance = await sc!.stableTokenContract.allowance(
//         sc!.issuerAddress,
//         sc!.odisPaymentsContract.address
//       );
//       let enoughAllowance = false;
//       if (sc!.quotaFee.gt(currentAllowance)) {
//         let approvalTxReceipt = await sc!.stableTokenContract.increaseAllowance(
//           sc!.odisPaymentsContract.address,
//           sc!.quotaFee
//         );
//         enoughAllowance = approvalTxReceipt.status;
//       } else {
//         enoughAllowance = true;
//       }
//       if (enoughAllowance) {
//         let odisPayment = await sc!.odisPaymentsContract.payInCUSD(
//           sc!.issuerAddress,
//           sc!.quotaFee
//         );
//       } else {
//         throw "ODIS => cUSD approval failed";
//       }
//     }
//   }

//   async function deregisterIdentifier(identifier: string) {
//     // console.log("deregisterIdentifier", { identifier });
//     try {
//       setProcessing(true);

//       if (address !== resolvedAccount) {
//         alert("Error, Address does not match.");
//         return;
//       }

//       let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
//       // console.log("deregisterIdentifier", { obfuscatedIdentifier });
//       await sc!.federatedAttestationsContract.revokeAttestation(
//         obfuscatedIdentifier,
//         sc!.issuerAddress,
//         address
//       );
//       alert("Success, Address de-registered.");
//     } catch (error) {
//       alert("Error de-registering address.");
//     } finally {
//       setProcessing(false);
//     }
//   }

//   async function copyTextToClipboard(text: string) {
//     if ("clipboard" in navigator) {
//       return await navigator.clipboard.writeText(text);
//     } else {
//       return document.execCommand("copy", true, text);
//     }
//   }


  return (
    <div>
    <div className="bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">
      <h1 className="font-bold text-2xl text-black my-2">Find Your Friend Directory</h1>
      <p>Find your friend by their twitter handle and send them money easily</p>
      <SearchBar />
    </div>
    <div className="w-full bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">
    <p>Wallet Address: <span>0X173638339</span></p>
    <p>Twitter Username: <span>@habiscus baby</span></p>
    <button className="w-2/5 p-2 my-3 bg-prosperity hover:bg-yellow-400  rounded-md text-black">
        Send money
    </button>
    </div>
    </div>
  )
}
