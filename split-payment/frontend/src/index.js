import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { CeloProvider } from '@celo/react-celo';
import '@celo/react-celo/lib/styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <CeloProvider
  dapp={{
    name: 'My awesome dApp',
    description: 'My awesome description',
    url: 'https://example.com',
  }}
  // Use the theme to customize the colors.
  // If you provide a theme, you must provide all values below!
  theme={{
    primary: '#6366f1',
    secondary: '#eef2ff',
    text: '#000000',
    textSecondary: '#1f2937',
    textTertiary: '#64748b',
    muted: '#e2e8f0',
    background: '#ffffff',
    error: '#ef4444',
  }}
  connectModal={{
    title: <span>Select Wallet</span>,
    providersOptions: {
      hideFromDefaults: false,
      additionalWCWallets: [
        // see https://github.com/WalletConnect/walletconnect-registry/#schema for a schema example
        {
          id: 'example-wallet',
          name: 'Example Wallet',
          description: 'Lorem ipsum',
          homepage: 'https://example.com',
          chains: ['eip:44787'],
          // IMPORTANT
          // This is the version of WC. We only support version 1 at the moment.
          versions: ['1'],
          logos: {
            sm: 'https://via.placeholder.com/40/000000/FFFFFF',
            md: 'https://via.placeholder.com/80/000000/FFFFFF',
            lg: 'https://via.placeholder.com/160/000000/FFFFFF',
          },
          app: {
            browser: '...',
            ios: '...',
            android: '...',
            mac: '...',
            windows: '..',
            linux: '...',
          },
          mobile: {
            native: '...',
            universal: '...',
          },
          desktop: {
            native: '...',
            universal: '...',
          },
          metadata: {
            shortName: '...',
            colors: {
              primary: '...',
              secondary: '...',
            },
          },
          responsive: {
            mobileFriendly: true,
            browserFriendly: true,
            mobileOnly: false,
            browserOnly: false,
          },
        },
      ],
    },
  }}
>
  <App />
</CeloProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
