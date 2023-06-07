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
} from "@/utils/constants";
import {
  AuthenticationMethod,
  AuthSigner,
  OdisContextName,
} from "@celo/identity/lib/odis/query";
import { ethers, Wallet } from "ethers";
import { useAuthState } from "react-firebase-hooks/auth";
import React, { use, useEffect, useState } from "react";
import styles from "@/styles/home.module.scss";
import { OdisUtils } from "@celo/identity";
import { WebBlsBlindingClient } from "../utils/webBlindingClient";

import Navbar, { CustomUser } from "@/components/Navbar/Navbar";
import { getAuth } from "firebase/auth";
import { app } from "@/firebase";
import { useAccount } from "wagmi";
import { ISocialConnect } from "@/utils/ISocialConnect";
import { useRouter } from "next/router";
import { notify } from "@/function/notify";
import Spinner from "@/components/Spinner/Spinner";

export default function Home() {
  let { address } = useAccount();
  let [sc, setSc] = useState<ISocialConnect>();
  const [processing, setProcessing] = useState(false);
  const [username, setUsername] = useState<string | undefined>("");
  const auth = getAuth(app);
  const [resolvedAccount, setResolvedAccount] = useState("");

  const [user, loading] = useAuthState(auth);
  const [baseUrl, setBaseUrl] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // Get the base URL
  useEffect(() => {
    setBaseUrl(window.location.origin);
  }, []);

  useEffect(() => {
    if (username) {
      setTimeout(() => {
        lookupAddress(username);
      }, 300);
    }
  }, [username]);

  useEffect(() => {
    let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    let issuer = new Wallet(ISSUER_PRIVATE_KEY!, provider);
    let serviceContext = OdisUtils.Query.getServiceContext(
      OdisContextName.ALFAJORES
    );
    let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey);
    let quotaFee = ethers.utils.parseEther("0.01");
    let authSigner: AuthSigner = {
      authenticationMethod: AuthenticationMethod.ENCRYPTION_KEY,
      rawKey: DEK_PRIVATE_KEY!,
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
    let sCVars: ISocialConnect = {
      issuerAddress: issuer.address,
      federatedAttestationsContract,
      odisPaymentsContract,
      stableTokenContract,
      authSigner,
      serviceContext,
      quotaFee,
      blindingClient,
    };
    setSc(sCVars);
  }, []);

  async function lookupAddress(username: string) {
    let obfuscatedIdentifier = getObfuscatedIdentifier(username.toLowerCase());
    let attestations =
      await sc!.federatedAttestationsContract.lookupAttestations(
        obfuscatedIdentifier,
        [sc!.issuerAddress]
      );
    let [latestAddress] = attestations.accounts;
    setResolvedAccount(latestAddress);
  }

  const setUsernameHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value);
  };

  const submitFormHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (resolvedAccount) {
      return deregisterIdentifier(username!);
    }
    if (username) {
      return registerAttestation(username, address!);
    }
  };

  useEffect(() => {
    if (user) {
      // @ts-ignore
      setUsername(user?.reloadUserInfo?.screenName.toLowerCase());
    }
  }, [user]);

  async function registerAttestation(identifier: string, account: string) {
    try {
      setProcessing(true);

      if (!user?.providerId || !address) {
        notify("error", "Please login first.");
        return;
      }

      // check and top up ODIS quota
      await checkAndTopUpODISQuota();
      let nowTimestamp = Math.floor(new Date().getTime() / 1000);
      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
      await sc!.federatedAttestationsContract.registerAttestationAsIssuer(
        obfuscatedIdentifier,
        account,
        nowTimestamp
      );
      notify("success", "Address mapped.");
    } catch (e) {
      notify("error", "Error mapping address.");
    } finally {
      setProcessing(false);
    }
  }

  async function getObfuscatedIdentifier(identifier: string) {
    let obfuscatedIdentifier = (
      await OdisUtils.Identifier.getObfuscatedIdentifier(
        identifier,
        OdisUtils.Identifier.IdentifierPrefix.TWITTER,
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

  async function checkAndTopUpODISQuota() {
    const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
      sc!.issuerAddress,
      sc!.authSigner,
      sc!.serviceContext
    );
    // console.log("remainingQuota", { remainingQuota });
    if (remainingQuota < 1) {
      let currentAllowance = await sc!.stableTokenContract.allowance(
        sc!.issuerAddress,
        sc!.odisPaymentsContract.address
      );
      let enoughAllowance = false;
      if (sc!.quotaFee.gt(currentAllowance)) {
        let approvalTxReceipt = await sc!.stableTokenContract.increaseAllowance(
          sc!.odisPaymentsContract.address,
          sc!.quotaFee
        );
        enoughAllowance = approvalTxReceipt.status;
      } else {
        enoughAllowance = true;
      }
      if (enoughAllowance) {
        let odisPayment = await sc!.odisPaymentsContract.payInCUSD(
          sc!.issuerAddress,
          sc!.quotaFee
        );
      } else {
        throw "ODIS => cUSD approval failed";
      }
    }
  }

  async function deregisterIdentifier(identifier: string) {
    // console.log("deregisterIdentifier", { identifier });
    try {
      setProcessing(true);

      if (address !== resolvedAccount) {
        notify("error", "Address does not match.");
        return;
      }

      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
      // console.log("deregisterIdentifier", { obfuscatedIdentifier });
      await sc!.federatedAttestationsContract.revokeAttestation(
        obfuscatedIdentifier,
        sc!.issuerAddress,
        address
      );
      notify("success", "Address de-registered.");
    } catch (error) {
      notify("error", "Error de-registering address.");
    } finally {
      setProcessing(false);
    }
  }

  async function copyTextToClipboard(text: string) {
    if ("clipboard" in navigator) {
      return await navigator.clipboard.writeText(text);
    } else {
      return document.execCommand("copy", true, text);
    }
  }

  // onClick handler function for the copy button
  const handleCopyClick = () => {
    // Asynchronously call copyTextToClipboard
    copyTextToClipboard(`${baseUrl}/${username}`)
      .then(() => {
        // If successful, update the isCopied state value
        notify("success", "Copied to clipboard.");
        setIsCopied(true);
        setTimeout(() => {
          setIsCopied(false);
        }, 1500);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <>
      <Navbar />
      <div className={styles.Home}>
        <div className={styles.Info}>
          <h1>Supporting devs is the foundation of innovation</h1>
          <p>
            Create profile. Share your link. Recieve tips. It&apos;s easier than
            you think.
          </p>
          <form className={styles.Form} onSubmit={submitFormHandler}>
            <div onClick={handleCopyClick}>
              <span>{baseUrl}/</span>
              <input
                placeholder="yourname"
                onChange={setUsernameHandler}
                value={username}
                disabled={true}
              />
            </div>
            <button
              disabled={processing}
              className={processing ? styles.disabled : undefined}
            >
              {processing ? (
                <Spinner />
              ) : resolvedAccount ? (
                "Stop My Page"
              ) : (
                "Start My Page"
              )}
            </button>
          </form>
          <small>
            Click on the link to copy your unique url after starting your page.
          </small>
        </div>
        {resolvedAccount && (
          <div
            style={{
              color: "#bcbcbc",
            }}
          >
            Username: {username![0].toUpperCase() + username!.slice(1)}
            <br />
            Connected Account: {resolvedAccount}
          </div>
        )}
      </div>
    </>
  );
}
