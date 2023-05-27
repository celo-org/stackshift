export declare const allowedStudioNetworks: readonly ["mainnet", "rinkeby", "goerli", "gnosis", "chapel", "optimism-goerli", "clover", "fantom", "matic", "fantom-testnet", "arbitrum-goerli", "fuji", "celo-alfajores", "mumbai", "aurora-testnet", "near-testnet", "optimism", "optimism-goerli", "theta-testnet-001", "osmo-test-4", "base-testnet", "celo", "arbitrum-one", "avalanche", "zksync-era", "sepolia", "polygon-zkevm-testnet", "polygon-zkevm"];
export declare const validateStudioNetwork: ({ studio, product, network, }: {
    studio?: string | boolean | undefined;
    product?: string | undefined;
    network?: string | undefined;
}) => void;
