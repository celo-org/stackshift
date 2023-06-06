import type { AppProps } from "next/app";
import { RainbowKitProvider } from "@rainbow-me/rainbowkit";
import { configureChains, createConfig, WagmiConfig } from "wagmi";
import { jsonRpcProvider } from "wagmi/providers/jsonRpc";
import celoGroups from "@celo/rainbowkit-celo/lists";
import { Alfajores, Celo } from "@celo/rainbowkit-celo/chains";
import "../styles/globals.scss";
import "@rainbow-me/rainbowkit/styles.css";
import { Toaster } from "react-hot-toast";

const projectId = "celo-composer-project-id"; // get one at https://cloud.walletconnect.com/app

const { chains, publicClient } = configureChains(
  [Alfajores, Celo],
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: "https://celo-alfajores.infura.io/v3/6b205f850b9745c590091e3dbbcf3a8c",
      }),
    }),
  ]
);

const connectors = celoGroups({
  chains,
  projectId,
  appName: (typeof document === "object" && document.title) || "Your App Name",
});

const wagmiConfig = createConfig({
  autoConnect: true,
  connectors,
  publicClient: publicClient,
});

function App({ Component, pageProps }: AppProps) {
  return (
    <WagmiConfig config={wagmiConfig}>
      <RainbowKitProvider chains={chains} coolMode={true}>
        <Component {...pageProps} />
        <Toaster
          toastOptions={{
            style: {
              width: "auto",
              maxWidth: "600px",
            },
          }}
        />
      </RainbowKitProvider>
    </WagmiConfig>
  );
}

export default App;
