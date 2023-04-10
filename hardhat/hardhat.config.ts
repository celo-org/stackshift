import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
// import "@nomicfoundation/hardhat-deploy";
import "@nomiclabs/hardhat-ethers";
require("hardhat-deploy");

import 'dotenv/config'

const { ALFAJORES_PRIVATE_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.17",
  defaultNetwork: "alfajores",
  networks: {
    localhost: {
      url: "http://127.0.0.1:7545",
    },
    alfajores: {
      url: "https://alfajores-forno.celo-testnet.org",
      accounts: [ALFAJORES_PRIVATE_KEY ?? ""],
      chainId: 44787,
    },
    celo: {
      url: "https://forno.celo.org",
      accounts: [ALFAJORES_PRIVATE_KEY ?? ""],
      chainId: 42220,
    },
  },
};

export default config;
