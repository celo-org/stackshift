// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const { ethers } = require("hardhat");

async function main() {
  const Splitter = await ethers.getContractFactory("Splitter");
  const split = await Splitter.deploy(
    
    "0x44477F952F3ac9EAdc8Eb694372182735b620975"
  ,
    "0xb395F443BA3Df615c7aF8A147c7d380dF6F9Db55"
  );

  await split.deployed({});

  console.log("Splitter:", split.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
