const { ethers } = require("hardhat");

async function main() {
  /*
  A ContractFactory in ethers.js is an abstraction used to deploy new smart contracts,
  so whitelistContract here is a factory for instances of our Whitelist contract.
  */
  const nftContract = await ethers.getContractFactory("RNFT");

  // here we deploy the contract
  const deployedNftContract = await nftContract.deploy(
    "https://baker.mypinata.cloud/ipfs/QmNwfJHjNKchyauLgcqBPYS2QiTKzzRDdsfKyprnMRJR1P/"
  );

  // Wait for it to finish deploying
  await deployedNftContract.deployed();

  // print the address of the deployed contract
  console.log("NFT Contract Address:", deployedNftContract.address);

  console.log("Sleeping.....");
  // Wait for etherscan to notice that the contract has been deployed
  await sleep(30000);

  // Verify the contract after deploying
  await hre.run("verify:verify", {
    address: deployedNftContract.address,
    constructorArguments: [
      "https://baker.mypinata.cloud/ipfs/QmNwfJHjNKchyauLgcqBPYS2QiTKzzRDdsfKyprnMRJR1P/",
    ],
    contract: "contracts/NFT.sol:RNFT",
  });

  function sleep(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}

// Call the main function and catch if there is any error
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
