import {
  ALFAJORES_CUSD_ADDRESS,
  ALFAJORES_RPC,
  FA_CONTRACT,
  FA_PROXY_ADDRESS,
  ODIS_PAYMENTS_CONTRACT,
  ODIS_PAYMENTS_PROXY_ADDRESS,
  STABLE_TOKEN_CONTRACT,
  ISSUER_PRIVATE_KEY,
  DEK_PRIVATE_KEY,
} from "./../utils/constants";
import Web3 from "web3";
import SearchBar from "../components/SearchBar";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OdisContext } from "../context/OdisContext";
import { OdisUtils } from "@celo/identity";
import { ethers, Wallet } from "ethers";
import { WebBlsBlindingClient } from "../utils/webBlindingClient";
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { ISocialConnect } from "../utils/ISocialConnect"
import { useIsMounted } from "../hooks/useIsMounted"
import { parseEther } from "ethers/lib/utils.js";
import { toast } from "react-hot-toast";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";
import Router from "next/router";

let ONE_CENT_CUSD = ethers.utils.parseEther("0.01");
const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);

export default function Home() {

  const [isLoaded, setIsLoaded] = useState(false);
  const [lookupValue, setLookupValue] = useState("");
  const [lookupResult, setLookupResult] = useState([]);
  const {
    issuer,
    serviceContext,
    authSigner,
    odisPaymentsContract,
    stableTokenContract,
    federatedAttestationsContract,
  } = useContext(OdisContext);

  // let isMounted = useIsMounted();

  // let [sc, setSc] = useState<ISocialConnect>();

  let { isConnected, address } = useAccount();

  let { data: session, status } = useSession();

  // let [socialIdentifier, setSocialIdentifier] = useState("");

  // const [processing, setProcessing] = useState(false);
  //   let [phoneNumber, setPhoneNumber] = useState("");

  useEffect(() => {
    setIsLoaded(true);
    console.log("session", session)
    console.log("status", status)
  }, []);

  if (!isLoaded) {
    return null;
  }

  function handleLookupValueChange({ target }) {
    let { value } = target;
    setLookupValue(value);
  }

  // let [identifierToSend, setIdentifierToSend] = useState("");

  // let [addressToSend, setAddressToSend] = useState("");

  // const [resolvedAccount, setResolvedAccount] = useState("");

  // useEffect(() => {
  //   if (sc) {
  //     setTimeout(() => {
  //       lookupAddress();
  //     }, 300);
  //   }
  // }, [sc]);



  //  useEffect(() => {
  //   // @ts-ignore: session was customized
  //   session && session?.username && setSocialIdentifier(session?.username)
  //  }, [session]);

  //  let { sendTransaction } = useSendTransaction({
  //   to: addressToSend,
  //   value: parseEther("0.1")
  //  })

  // let steps = [
  //   {
  //     id: 1,
  //     content: "User Connection",
  //     active: !!address,
  //   },
  //   {
  //     id: 2,
  //     content: "Verify identifier ownership",
  //     active: !!session,
  //   },
  //   {
  //     id: 3,
  //     content: "Map identifier with connected address",
  //     active: !!address && !!session,
  //   },
  //   {
  //     id: 4,
  //     content: "Send value through identifier",
  //     active: !!address && !!addressToSend,
  //   },
  //   {
  //     id: 5,
  //     content: "De-register identifier",
  //     active: !!address && !!session,
  //   }
  // ]

  // let identifierLogin = () => {
  //   if (session) {
  //     return (
  //       <>
  //       <SessionCard session={session} />
  //       <button
  //       className="bg-black text-white"
  //       onClick={() => {signOut()}}
  //       >
  //       SignOut
  //       </button>
  //       </>
  //     )
  //   } 
  //   return (
  //     <>
  //      <button
  //      className="bg-black text-white"
  //      onClick={() => {signIn()}}
  //      >
  //       Sign In
  //      </button>
  //     </>
  //   )
  // }

  async function checkAndTopUpODISQuota() {
    const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
      issuer?.address,
      authSigner,
      serviceContext
    );
    console.log(remainingQuota);

    if (remainingQuota < 1) {
      const currentAllowance = await stableTokenContract.allowance(
        issuer.address,
        odisPaymentsContract.address
      );
      console.log("current allowance:", currentAllowance.toString());
      let enoughAllowance: boolean = false;

      if (ONE_CENT_CUSD.gt(currentAllowance)) {
        const approvalTxReceipt = await stableTokenContract
          .increaseAllowance(
            odisPaymentsContract.address,
            ONE_CENT_CUSD
          )
          .sendAndWaitForReceipt();
        console.log("approval status", approvalTxReceipt.status);
        enoughAllowance = approvalTxReceipt.status;
      } else {
        enoughAllowance = true;
      }

      // increase quota
      if (enoughAllowance) {
        const odisPayment = await odisPaymentsContract
          .payInCUSD(issuer.address, ONE_CENT_CUSD)
          .sendAndWaitForReceipt();
        console.log("odis payment tx status:", odisPayment.status);
        console.log(
          "odis payment tx hash:",
          odisPayment.transactionHash
        );
      } else {
        throw "cUSD approval failed";
      }
    }
  }


  async function getIdentifier(twitterHandle: string) {
    try {
      await checkAndTopUpODISQuota();

      const blindingClient = new WebBlsBlindingClient(
        serviceContext.odisPubKey
      );

      await blindingClient.init();

      const { obfuscatedIdentifier } =
        await OdisUtils.Identifier.getObfuscatedIdentifier(
          twitterHandle,
          IdentifierPrefix.TWITTER,
          issuer.address,
          authSigner,
          serviceContext,
          undefined,
          undefined,
          blindingClient
        );

      return obfuscatedIdentifier;
    } catch (e) {
      console.log(e);
    }
  }

  async function registerIdentifier(twitterHandle: string, address: string) {
    try {
      const identifier = await getIdentifier(twitterHandle);

      console.log("Identifier", identifier);

      let tx =
        await federatedAttestationsContract.registerAttestationAsIssuer(
          identifier,
          address,
          NOW_TIMESTAMP
        );

      let receipt = await tx.wait();
      console.log(receipt);
      toast.success("Registered!", { icon: "🔥" });
    } catch {
      toast.error("Something Went Wrong", { icon: "😞" });
    }
  }

  // async function revokeIdentifier(twitterHandle: string, address: string) {
  //   try {
  //     const identifier = await getIdentifier(twitterHandle);

  //     console.log("Identifier", identifier);

  //     let tx = await federatedAttestationsContract.revokeAttestation(
  //       identifier,
  //       issuer.address,
  //       address
  //     );

  //     let receipt = await tx.wait();
  //     console.log(receipt);
  //     toast.success("Revoked!", { icon: "🔥" });
  //   } catch {
  //     toast.error("Something Went Wrong", { icon: "😞" });
  //   }
  // }

  async function lookupAddresses(twitterHandle: string) {
    try {
      const obfuscatedIdentifier = await getIdentifier(twitterHandle);

      // query onchain mappings
      const attestations =
        federatedAttestationsContract.lookupAttestations(
          obfuscatedIdentifier,
          [issuer.address]
        );

      toast.promise(attestations, {
        loading: "Searching...",
        success: (data: { accounts: any[] }) => {
          let accounts = data.accounts;
          if (accounts.length > 0) {
            setLookupResult(accounts);
          } else {
            toast.error("No Accounts found", { icon: "🧐" });
            Router.push("/create-profile");
          }
          return ""; // Return a valid renderable value
        },
        error: (err) => {
          toast.error("Something Went Wrong", { icon: "❌" });
          return "";
        },
      });
    } catch {
      toast.error("Something went wrong", { icon: "😞" });
    }
  }


  return (
    <div className="max:w-[600px] min:w-[300px] mx-auto p-2">
      <div className="bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">
        <h1 className="font-bold text-2xl text-black my-2">Find Your Friend Directory</h1>
        <p>Find your friend by their twitter handle and send them money easily</p>
        <div className="flex items-center w-full max-w-md mx-auto my-8 p-4 bg-white rounded-md shadow">
          <input
            type="text"
            className="w-3/5 p-2 rounded-l-md outline-none"
            placeholder="Twitter handle only (not @)"
            value={lookupValue}
            onChange={handleLookupValueChange}
          />
          <button
            onClick={() => lookupAddresses(lookupValue)}
            className="w-2/5 p-2 bg-prosperity hover:bg-yellow-400  rounded-md text-black"
            disabled={lookupValue == ""}
          >
            Search
          </button>
        </div>
        <div>
          {lookupResult.length > 0 && lookupResult.map((address) => {
            return (
              <div className="w-full bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center ">

                <p>Wallet Address:
                  <a
                    href={`https://explorer.celo.org/address/${address}`}
                    target="_blank"
                    key={address}
                  ><span className="underline">
                      {`${(
                        address as string
                      ).slice(0, 10)}...${(
                        address as string
                      ).slice(-10)}`}
                    </span></a></p>
                <p>Twitter Username: <span>@{lookupValue}</span></p>
                <button className="w-2/5 p-2 my-3 bg-prosperity hover:bg-yellow-400  rounded-md text-black ">
                  Send money
                </button>
              </div>
            );
          })}
        </div>
      </div>

    </div >
  )
}
