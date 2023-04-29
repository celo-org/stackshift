import "@/styles/globals.css";
import { CeloProvider } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";

export default function App({ Component, pageProps }) {
  return (
    <CeloProvider
      dapp={{
        name: "Dynamic NFT App",
        description: "Get your dynamic NFT",
        url: "https://example.com",
      }}
    >
      <Component {...pageProps} />
    </CeloProvider>
  );
  // return <Component {...pageProps} />
}
