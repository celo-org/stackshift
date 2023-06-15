import { OdisUtils } from "@celo/identity";
import { AuthSigner } from "@celo/identity/lib/odis/query";
import { newKit } from "@celo/contractkit";
import { ALFAJORES_ACCOUNT_PK, ALFAJORES_ACCOUNT, ALFAJORES_RPC } from "../Constants"
import { OdisContextName } from "@celo/identity/lib/odis/query";

export const quotaBalance = async () => {
  // create alfajores contractKit instance with the issuer private key
  const kit = await newKit("https://alfajores-forno.celo-testnet.org");
  kit.addAccount(ALFAJORES_ACCOUNT_PK);
 
  // authSigner provides information needed to authenticate with ODIS
  const authSigner: AuthSigner = {
      authenticationMethod: OdisUtils.Query.AuthenticationMethod.WALLET_KEY,
      contractKit: kit,
  };
  // serviceContext provides the ODIS endpoint and public key
  const serviceContext = OdisUtils.Query.getServiceContext(
    OdisContextName.ALFAJORES,
  );

  // check existing quota on issuer account
  const { remainingQuota } = await OdisUtils.Quota.getPnpQuotaStatus(
      ALFAJORES_ACCOUNT,
      authSigner,
      serviceContext
  );

  // if needed, approve and then send payment to OdisPayments to get quota for ODIS
  if (remainingQuota < 1) {
      const stableTokenContract = await kit.contracts.getStableToken();
      const odisPaymentsContract = await kit.contracts.getOdisPayments();
      const ONE_CENT_CUSD_WEI = 10000000000000000;
      await stableTokenContract
          .increaseAllowance(odisPaymentsContract.address, ONE_CENT_CUSD_WEI)
          .sendAndWaitForReceipt();
      const odisPayment = await odisPaymentsContract
          .payInCUSD(ALFAJORES_ACCOUNT, ONE_CENT_CUSD_WEI)
        .sendAndWaitForReceipt();
    console.log(odisPayment)
    return {authSigner, serviceContext, odisPayment}
  }
}
