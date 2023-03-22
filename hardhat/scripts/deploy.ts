import { ethers } from "hardhat";
import "@nomiclabs/hardhat-etherscan";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("deploying the contract with account", deployer.address);

  console.log("Account balance:", (await deployer.getBalance()).toString());

  const Split = await ethers.getContractFactory("Split");
  const split = await Split.deploy();

  await split.deployed();

  console.log("contract deployed at", split.address);
}


// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
