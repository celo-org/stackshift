import "@/styles/globals.css";
import { CeloProvider, Alfajores } from "@celo/react-celo";
import "@celo/react-celo/lib/styles.css";

export default function App({ Component, pageProps }) {
  return (
    <CeloProvider
      dapp={{
        name: "Split Payment dapp",
        url: "https://example.com",
        icon: "https://example.com/favicon.ico",
      }}
      defaultNetwork={Alfajores.name}
      connectModal={{
        providersOptions: { searchable: true },
      }}
    >
      <Component {...pageProps} />
    </CeloProvider>
  );
}
