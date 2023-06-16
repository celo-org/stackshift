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
} from '../utils/constants';
import { OdisUtils } from '@celo/identity';
import {
  AuthenticationMethod,
  AuthSigner,
  OdisContextName
} from '@celo/identity/lib/odis/query';
import { ethers, Wallet } from 'ethers';
import { WebBlsBlindingClient } from '../utils/webBlindingClient';
import { parseEther } from 'viem';
import { useSession } from 'next-auth/react';

import { useAccount, useSendTransaction } from 'wagmi';
import { ISocialConnect } from '@/utils/ISocialConnect';

import { useEffect, useState } from 'react';

export default function Home() {
  let [sc, setSc] = useState<ISocialConnect>();
  let [phone, setPhone] = useState('');
  const [amount, setAmount] = useState('');

  let { address } = useAccount();

  let [socialIdentifier, setSocialIdentifier] = useState('');

  let [addressToSend, setAddressToSend] = useState('');

  useEffect(() => {
    let provider = new ethers.providers.JsonRpcProvider(ALFAJORES_RPC);
    let issuer = new Wallet(ISSUER_PRIVATE_KEY!, provider);
    let serviceContext = OdisUtils.Query.getServiceContext(
      OdisContextName.ALFAJORES
    );
    let blindingClient = new WebBlsBlindingClient(serviceContext.odisPubKey);
    let quotaFee = ethers.utils.parseEther('0.01');
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
    let sCVars: ISocialConnect = {
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

  let { sendTransaction } = useSendTransaction({
    to: addressToSend,
    value: parseEther('4', 'wei')
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
        throw 'ODIS => cUSD approval failed';
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
    await checkAndTopUpODISQuota();
    let nowTimestamp = Math.floor(new Date().getTime() / 1000);
    let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
    await sc!.federatedAttestationsContract.registerAttestationAsIssuer(
      obfuscatedIdentifier,
      account,
      nowTimestamp
    );
    alert('Address mapped.');
  }

  async function lookupAddress() {
    let obfuscatedIdentifier = getObfuscatedIdentifier(socialIdentifier);
    let attestations =
      await sc!.federatedAttestationsContract.lookupAttestations(
        obfuscatedIdentifier,
        [sc!.issuerAddress]
      );
    let [latestAddress] = attestations.accounts;
    setAddressToSend(latestAddress);
  }

  async function deregisterIdentifier(identifier: string) {
    try {
      let obfuscatedIdentifier = getObfuscatedIdentifier(identifier);
      await sc!.federatedAttestationsContract.revokeAttestation(
        obfuscatedIdentifier,
        sc!.issuerAddress,
        address
      );
      alert('Address de-registered.');
    } catch (error) {}
  }

  return (
    <main>
      <div>
        <div>
          <div>
            <div className=' flex flex-col items-center'>
              <h1 className=' text-[2rem] text-center font-bold'>
                Social Connect DAPP
              </h1>
            </div>
          </div>
        </div>
        <div>
          <p className=' pt-10 font-semibold text-[20px]'>Register</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              registerAttestation(phone, address!);
            }}
            className=' flex gap-10'
          >
            <input
              type='tel'
              onChange={(e) => setPhone(e.target.value)}
              placeholder='Enter Mobile Number Here'
              className=' border-red-300 border-2 py-4 h-12 w-80  px-2 rounded-lg w-[500px]'
            />

            <button
              type='submit'
              className=' border-blue border-4 px-8 bg-blue-500 h-12 w-32  rounded-lg text-[14px]'
            >
              Register
            </button>
          </form>
        </div>

        <div>
          <p className=' pt-10 font-semibold text-[20px]'>Verify Recepient</p>
          <form
            onSubmit={(e) => {
              e.preventDefault();
              lookupAddress();
            }}
            className=' flex gap-10'
          >
            <input
              type='tel'
              onChange={(e) => setSocialIdentifier(e.target.value)}
              placeholder='Enter Mobile  Number of Receiver'
              className='  border-red-300 border-2 py-4 px-2 h-12 w-80 rounded-lg w-[500px]'
            />

            <button
              type='submit'
              className=' border-blue border-4 px-8 bg-blue-500 h-12 w-32  rounded-lg text-[14px]'
            >
              Verify
            </button>
          </form>

          <div>
            {/* <p className=' pt-10 font-semibold text-[20px]'>Send Celo Token</p> */}
            <p className=' mb-5  text-black py-4 px-2 rounded-lg w-[500px]'>
              Recepient Address: {addressToSend}
            </p>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendTransaction();
              }}
              className=' flex '
            >
              <button
                type='submit'
                className=' border-blue border-4 px-8 bg-blue-500 h-12 w-32  rounded-lg text-[14px]'
              >
                Send
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
