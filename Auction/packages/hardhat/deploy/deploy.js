// Import ethers from Hardhat package
const { ethers } = require("hardhat");

async function main() {
  // We get the contract to deploy
  const Auction = await ethers.getContractFactory("AuctionContract");

  const auction = await Auction.deploy();

  // here we deploy the contract
  await auction.deployed();
  // print the address of the deployed contract
  console.log("Pay deployed to:", auction.address);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: auction.address,
    constructorArguments: [],
    contract: "contracts/Auction.sol:AuctionContract",
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
