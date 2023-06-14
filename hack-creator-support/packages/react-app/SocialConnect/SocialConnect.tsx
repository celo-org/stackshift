import { newKit } from "@celo/contractkit";
import { ALFAJORES_ACCOUNT_PK, ALFAJORES_ACCOUNT } from "../Constants"
import { OdisUtils } from '@celo/identity';
import { OdisContextName } from "@celo/identity/lib/odis/query";
import { AuthSigner } from "@celo/identity/lib/odis/query";
import { WebBlsBlindingClient } from "@/utils/WebBlindingClient";
import toast, { Toast } from "react-hot-toast";
    
const kit = newKit("https://alfajores-forno.celo-testnet.org");
kit.addAccount(ALFAJORES_ACCOUNT_PK);
    
const issuerAddress =
kit.web3.eth.accounts.privateKeyToAccount(ALFAJORES_ACCOUNT_PK).address;
kit.defaultAccount = issuerAddress;
    
// time at which issuer verified the user owns their identifier
const attestationVerifiedTime = Date.now();


export const getIdentifier = async (twitterHandle: string) => {
     // the issuer is the account that is registering the attestation
    
  try {
      // information provided by user, issuer should confirm they do own the identifier
    const userPlaintextIdentifier = twitterHandle;


     // authSigner provides information needed to authenticate with ODIS
  const authSigner: AuthSigner = {
      authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
      contractKit: kit,
  };
  // serviceContext provides the ODIS endpoint and public key
  const serviceContext = OdisUtils.Query.getServiceContext(
    OdisContextName.ALFAJORES,
  );
    
    const blindingClient = new WebBlsBlindingClient(
                serviceContext.odisPubKey
            );

            await blindingClient.init();
    
    // get obfuscated identifier from plaintext identifier by querying ODIS
    const { obfuscatedIdentifier } =
        await OdisUtils.Identifier.getObfuscatedIdentifier(
            userPlaintextIdentifier as string,
            OdisUtils.Identifier.IdentifierPrefix.TWITTER,
            issuerAddress,
            authSigner,
          serviceContext,
            undefined,
            undefined,
            blindingClient
      );
    
    console.log(obfuscatedIdentifier)
    toast(` Successfully obfuscated, ${obfuscatedIdentifier}`)
  return obfuscatedIdentifier
  } catch (error) {
      toast.error(` Error occured ${error}`)
    }
    
  }

  export const registerIdentifier = async (twitterHandle: string, address: string) => {
    // the issuer is the account that is registering the attestation

    try {
       // create alfajores contractKit instance with the issuer private key
    const kit = await newKit("https://alfajores-forno.celo-testnet.org");
    kit.addAccount(ALFAJORES_ACCOUNT_PK);
    const issuerAddress =
        kit.web3.eth.accounts.privateKeyToAccount(ALFAJORES_ACCOUNT_PK).address;
    kit.defaultAccount = issuerAddress;

    const federatedAttestationsContract =
    await kit.contracts.getFederatedAttestations();

    const obfuscatedIdentifier = await getIdentifier(twitterHandle)
    // upload identifier <-> address mapping to onchain registry - Address Mapping
   const response =  await federatedAttestationsContract
        .registerAttestationAsIssuer(
            obfuscatedIdentifier as string,
            address,
            attestationVerifiedTime
        )
     .send();
      console.log(response.getHash)
      toast(` Successfully register, ${response.getHash}`)
    } catch (error) {
      toast.error(` Error occured ${error}`)
      console.log(error)
    } 
  }

 export const accountAddressLookUp = async (identifier: string) => {
   try {
      const federatedAttestationsContract =
      await kit.contracts.getFederatedAttestations();
    
    const attestations = await federatedAttestationsContract.lookupAttestations(
      identifier,
        [ALFAJORES_ACCOUNT]
    );

    // console.log(attestations.accounts);
    return attestations.accounts
   } catch (error) {
      toast.error(` Error occured ${error}`)
    }
    
 }
  
export const revokeAttestation = async (twitterHandle : string, address: string) => {
  try {
      const federatedAttestationsContract =
        await kit.contracts.getFederatedAttestations();
    
            const identifier = await getIdentifier(twitterHandle);

            console.log("Identifier", identifier);

            let tx = await federatedAttestationsContract.revokeAttestation(
                identifier as string,
                ALFAJORES_ACCOUNT,
                address
            );

            let receipt = await tx.wait();
            console.log(receipt);
            toast.success("Revoked!", { icon: "🔥" });
        } catch {
            toast.error("Something Went Wrong", { icon: "😞" });
        }
 }

