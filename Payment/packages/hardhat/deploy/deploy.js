// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Pay = await ethers.getContractFactory("Pay");

  const pay = await Pay.deploy();

  // here we deploy the contract
  await pay.deployed();
  // print the address of the deployed contract
  console.log("Pay deployed to:", pay.address);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: pay.address,
    constructorArguments: [],
    contract: "contracts/Pay.sol:Pay",
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
