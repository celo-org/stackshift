require("@nomicfoundation/hardhat-toolbox");
require ("dotenv").config();

const { PRIVATE_KEY } = process.env;

/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  solidity: "0.8.17",
  networks: {
      // Celo Alfajores testnet
      alfajores: {
        url: "https://alfajores-forno.celo-testnet.org",
        accounts: [PRIVATE_KEY],
        chainId: 44787
      }
    }
};
