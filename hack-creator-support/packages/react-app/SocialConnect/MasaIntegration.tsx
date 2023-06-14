import { Masa } from "@masa-finance/masa-sdk";
import { providers } from "ethers";
 import {usePublicClient} from "wagmi"
// with metamask
const web3Provider = usePublicClient()
const provider = new providers.Web3Provider( window.CELO);
const signer = provider.getSigner();

export const masa = new Masa({
  signer,
});

const MasaIntegration = () => {
    return(
        <div className="text-white">
            {/* {masa.account.getBalances} */}
            Hello from masa
        </div>
    )
}

export default MasaIntegration