import { ConnectButton } from "@rainbow-me/rainbowkit";
import { OdisContext } from "../context/OdisContext";
import { OdisUtils } from "@celo/identity";
import { ethers, Wallet } from "ethers";
import { WebBlsBlindingClient } from "../utils/webBlindingClient";
import { useSession, signIn, signOut } from "next-auth/react"
import React, { useContext, useEffect, useState } from "react";
import { useAccount, useSendTransaction } from "wagmi";
import { toast } from "react-hot-toast";
import { IdentifierPrefix } from "@celo/identity/lib/odis/identifier";

let ONE_CENT_CUSD = ethers.utils.parseEther("0.01");
const NOW_TIMESTAMP = Math.floor(new Date().getTime() / 1000);

export default function CreateProfile() {

  const [isLoaded, setIsLoaded] = useState(false);
  
  const {
    issuer,
    serviceContext,
    authSigner,
    odisPaymentsContract,
    stableTokenContract,
    federatedAttestationsContract,
  } = useContext(OdisContext);

  let { isConnected, address } = useAccount();

  let { data: session, status } = useSession();

  useEffect(() => {
    setIsLoaded(true);
    console.log("session", session)
    console.log("status", status)
  }, []);

  if (!isLoaded) {
    return null;
  }

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

  async function revokeIdentifier(twitterHandle: string, address: string) {
    try {
      const identifier = await getIdentifier(twitterHandle);

      console.log("Identifier", identifier);

      let tx = await federatedAttestationsContract.revokeAttestation(
        identifier,
        issuer.address,
        address
      );

      let receipt = await tx.wait();
      console.log(receipt);
      toast.success("Revoked!", { icon: "🔥" });
    } catch {
      toast.error("Something Went Wrong", { icon: "😞" });
    }
  }

  const handleSignIn = async () => {
    await signIn('twitter');
  };

  return (
    <div className="max:w-[600px] min:w-[300px] mx-auto p-2">
      {/*  register and login */}
      <div className="bg-gray-100 my-[50px] rounded-lg p-[40px] justify-center place-content-center text-center">
        <h1 className="font-bold text-2xl text-black my-2">Create Your Profile In The Directory</h1>
        <p>Connect your wallet & link Twitter</p>
        <div className="my-6 justify-center  flex ">
          {isConnected ? (
            <div>
              <span className="text-center flex justify-center">
                <ConnectButton showBalance={false} />
              </span>
              <div className="mt-8 mb-5 w-full  flex flex-col">
                {isConnected && status === "unauthenticated" ? (
                  <button
                    onClick={handleSignIn}
                    className="border-2 border-blue-500 px-4 py-2 w-full bg-blue-500 text-white"
                  >
                    Sign in with Twitter
                  </button>
                ) : status === "loading" ? (
                  <h1 className="font-bold">Loading...</h1>
                ) : null
                }
              </div>
              {issuer && (
                <div className="border flex py-2 justify-center border-black">
                  <h3>
                    Issuer Address:{" "}
                    <a
                      href={`https://explorer.celo.org/alfajores/address/${issuer.address}`}
                      className="underline"
                      target="_blank"
                    >
                      {issuer.address}
                    </a>
                  </h3>
                </div>
              )}
              {isConnected && status === "authenticated" && (
                <div>

                  {/* <div className="flex space-x-2 w-full items-center">
                    <img
                      style={{
                        width: "50px",
                        height: "50px",
                        borderRadius: "100%",
                      }}
                      src={session!.user?.image as string}
                    />
                    <div className="flex flex-col">
                      <h2>{session!.user!.name}</h2>
                      <h3>{`@${session!.user.name.toLowerCase()}`}</h3>
                    </div>
                  </div> */}
                  <button
                    onClick={() =>
                      registerIdentifier(
                        session.user?.name?.toLowerCase(),
                        address
                      )
                    }
                    className="border-2 border-black px-4 py-2 w-full"
                  >
                    Link Wallet
                  </button>
                </div>

              )}
            </div>
          ) : (
            <div>
              <ConnectButton showBalance={false} />
            </div>
          )}
        </div>

      </div>

    </div >
  )
}


