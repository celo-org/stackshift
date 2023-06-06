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
import React, { use, useEffect, useState } from "react";
import axios from "axios";
import { RiCupFill } from "react-icons/ri";
import QuickClick from "@/components/QuickClick/QuickClick";
import Spinner from "@/components/Spinner/Spinner";
import { OdisUtils } from "@celo/identity";
import { WebBlsBlindingClient } from "../utils/webBlindingClient";
import { GetServerSideProps, GetServerSidePropsContext, NextPage } from "next";

import { ISocialConnect } from "@/utils/ISocialConnect";

import styles from "@/styles/user.module.scss";
import { notify } from "@/function/notify";
import Navbar from "@/components/Navbar/Navbar";
import { useSendTransaction } from "wagmi";
import { parseEther } from "viem";

interface UserProfile {
  fullName: string;
  profilePicture: string;
  username: string;
  bio: string;
}

const User: NextPage<{ user: UserProfile }> = ({ user }) => {
  let [sc, setSc] = useState<ISocialConnect>();

  const [amount, setAmount] = useState(1);
  const [inputValue, setInputValue] = useState<number>();
  const [isDonating, setIsDonating] = useState(false);
  const [addressToSend, setAddressToSend] = useState<string | null>(null);
  let { sendTransaction } = useSendTransaction({
    to: addressToSend!,
    value: parseEther(`${amount}`, "wei"),
  });

  useEffect(() => {
    if (sc) {
      setTimeout(() => {
        lookupAddress();
      }, 300);
    }
  }, [sc]);

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

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    let manualAmount = e.target.value;
    manualAmount === "" ? setAmount(1) : setAmount(parseInt(manualAmount));
    setInputValue(parseInt(e.target.value));
  };

  const setAmountHandler = (value: number) => {
    if (isDonating) return;

    setAmount(value);
    setInputValue(value);
  };

  const donate = () => {
    // setIsDonating(true)
  };

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

  async function lookupAddress() {
    let obfuscatedIdentifier = getObfuscatedIdentifier(
      user.username.toLowerCase()
    );
    let attestations =
      await sc!.federatedAttestationsContract.lookupAttestations(
        obfuscatedIdentifier,
        [sc!.issuerAddress]
      );
    let [latestAddress] = attestations.accounts;
    if (!latestAddress) {
      notify("error", "No address found for this user");
    }
    setAddressToSend(latestAddress);
  }

  return (
    <>
      <Navbar filled={true} />
      <div className={styles.Contribution}>
        <div className={styles.Header}>
          <div
            className={styles.profilePicture}
            style={{
              backgroundImage: `url(${
                user.profilePicture ??
                "https://static-cdn.jtvnw.net/jtv_user_pictures/463f85bf-721c-450c-8d6f-0e602b3e3807-profile_image-300x300.png"
              })`,
            }}
          ></div>
        </div>

        <div className={styles.Info}>
          <h1>{user.fullName}</h1>
          <p
            style={{
              color: user.bio ? "black" : "gray",
            }}
          >
            {user.bio ?? "This profile has no bio"}
          </p>
        </div>

        <div className={styles.supportBlock}>
          <div className={styles.support}>
            <h3>
              Tip <span>{user.username}</span> some celo
            </h3>
            <div className={styles.input}>
              <RiCupFill fill="#476520" size="2.5em" />{" "}
              <span>
                <b>x</b>
              </span>
              <QuickClick
                value={1}
                amount={amount}
                setAmountHandler={setAmountHandler}
              />
              <QuickClick
                value={3}
                amount={amount}
                setAmountHandler={setAmountHandler}
              />
              <QuickClick
                value={5}
                amount={amount}
                setAmountHandler={setAmountHandler}
              />
              <input
                type="number"
                min="0"
                onChange={onChangeHandler}
                placeholder="1"
                value={inputValue}
                disabled={isDonating}
              />
            </div>
            {addressToSend === null ? (
              <Spinner />
            ) : (
              <>
                {addressToSend ? (
                  <button
                    type="button"
                    disabled={amount < 1 || isDonating}
                    onClick={() => sendTransaction()}
                  >
                    {isDonating ? <Spinner /> : `Tip ${amount} $CELO`}
                  </button>
                ) : (
                  <p
                    style={{
                      textAlign: "center",
                      color: "red",
                      marginTop: "2em",
                    }}
                  >
                    Account not mapped to an address
                  </p>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export const getServerSideProps: GetServerSideProps<{
  user: UserProfile;
}> = async (context: GetServerSidePropsContext) => {
  const { user } = context.params as { user: string };

  const res = await axios.get<
    Promise<{
      id: number;
      name: string;
      avatar_url: string;
      login: string;
      bio: string;
    }>
  >(`https://api.github.com/users/${user}`);
  const data = await res.data;

  // if no data, return not found and redirect to 404
  if (!data.id) {
    return {
      notFound: true,
      redirect: {
        destination: "/404",
        permanent: false,
      },
    };
  }

  return {
    props: {
      user: {
        fullName: data.name,
        profilePicture: data.avatar_url,
        username: data.login,
        bio: data.bio,
      },
    },
  };
};

export default User;
