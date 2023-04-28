const { ethers } = require("hardhat");

async function main() {

  const dynamicNFTContract = await ethers.getContractFactory("DynamicNFT");

  const deployedDynamicNFTContract = await dynamicNFTContract.deploy();

  await deployedDynamicNFTContract.deployed();

  console.log("Dynamic NFT Contract Address:", deployedDynamicNFTContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });