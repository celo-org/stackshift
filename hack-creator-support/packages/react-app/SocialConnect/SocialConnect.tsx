import React, { useState } from 'react'
import { newKit } from "@celo/contractkit";
import { ALFAJORES_ACCOUNT_PK, ALFAJORES_ACCOUNT } from "../Constants"
import { useAccount } from 'wagmi';
import { useSession, signIn, signOut } from "next-auth/react"
import { OdisUtils } from '@celo/identity';
import { OdisContextName } from "@celo/identity/lib/odis/query";
import { AuthSigner } from "@celo/identity/lib/odis/query";


export default function SocialConnect() {
  const { address } = useAccount()
  const { data: session } = useSession()
  const [identifier, setIdentifier] = useState<string>("")

  const mapIdentifierToAddress = async () => {
    // the issuer is the account that is registering the attestation
    
    // create alfajores contractKit instance with the issuer private key
    const kit = await newKit("https://alfajores-forno.celo-testnet.org");
    kit.addAccount(ALFAJORES_ACCOUNT_PK);
    const issuerAddress =
        kit.web3.eth.accounts.privateKeyToAccount(ALFAJORES_ACCOUNT_PK).address;
    kit.defaultAccount = issuerAddress;

    // information provided by user, issuer should confirm they do own the identifier
    const userPlaintextIdentifier = session?.user && session.user.email;
    const userAccountAddress = address;

    // time at which issuer verified the user owns their identifier
    const attestationVerifiedTime = Date.now();

     // authSigner provides information needed to authenticate with ODIS
  const authSigner: AuthSigner = {
      authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
      contractKit: kit,
  };
  // serviceContext provides the ODIS endpoint and public key
  const serviceContext = OdisUtils.Query.getServiceContext(
    OdisContextName.ALFAJORES,
  );
    
    // get obfuscated identifier from plaintext identifier by querying ODIS
    const { obfuscatedIdentifier } =
        await OdisUtils.Identifier.getObfuscatedIdentifier(
            userPlaintextIdentifier as string,
            OdisUtils.Identifier.IdentifierPrefix.TWITTER,
            issuerAddress,
            authSigner,
            serviceContext
      );
    
    console.log(obfuscatedIdentifier)
    setIdentifier(obfuscatedIdentifier)

    const federatedAttestationsContract =
    await kit.contracts.getFederatedAttestations();

    // upload identifier <-> address mapping to onchain registry - Address Mapping
    await federatedAttestationsContract
        .registerAttestationAsIssuer(
            obfuscatedIdentifier,
            userAccountAddress as string,
            attestationVerifiedTime
        )
        .send();
  }

  const accountAddressLookUp = async () => {
    const kit = await newKit("https://alfajores-forno.celo-testnet.org");
    kit.addAccount(ALFAJORES_ACCOUNT_PK);

    const federatedAttestationsContract =
      await kit.contracts.getFederatedAttestations();
    
    const attestations = await federatedAttestationsContract.lookupAttestations(
      identifier,
        [ALFAJORES_ACCOUNT]
    );

    console.log(attestations.accounts);
  }

  return (
    <div>
      <button onClick={mapIdentifierToAddress} className='bg-blue-500 p-2'> Map Connected User</button>
    </div>
  )
}
