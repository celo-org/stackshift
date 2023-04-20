const hre = require("hardhat");

async function main() {
  const DynamicNFT = await hre.ethers.getContractFactory("DynamicNFT");
  const dynamicNFT = await DynamicNFT.deploy();
  await dynamicNFT.deployed();
  console.log("DynamicNFT:", dynamicNFT.address);

  const NFT = await hre.ethers.getContractFactory("NFT");
  const nft = await NFT.deploy();
  await nft.deployed();
  console.log("NFT:", nft.address);
}

main();
