import "../styles/globals.css";
import React, {useState, useEffect} from "react";
import type { AppProps } from "next/app";
import { CeloProvider, Alfajores, NetworkNames} from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';

import Layout from "../components/Layout";

function App({ Component, pageProps }: AppProps) {
  const [showChild, setShowChild] = useState(false);
  useEffect(() => {
    setShowChild(true);
  }, []);

  if (!showChild) {
    return null;
  }

  if (typeof window === 'undefined') {
    return <></>;
  } else {
    return (
      <CeloProvider
        dapp={{
          name: 'celo-composer dapp',
          description: 'My awesome celo-composer description',
          url: 'https://example.com',
          icon: 'https://example.com/favicon.ico',
        }}
        // defaultNetwork={Alfajores.name}
        networks={[Alfajores]}
        network={{
          name: NetworkNames.Alfajores,
          rpcUrl: 'https://alfajores-forno.celo-testnet.org',
          graphQl: 'https://alfajores-blockscout.celo-testnet.org/graphiql',
          explorer: 'https://alfajores-blockscout.celo-testnet.org',
          chainId: 44787,
        }}
        connectModal={{
          providersOptions: { searchable: true },
        }}
      >
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </CeloProvider>
    )
  }
}

export default App;