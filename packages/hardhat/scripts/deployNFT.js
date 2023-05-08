const hre = require("hardhat");

async function main() {
  const AuctionNFT = await hre.ethers.getContractFactory("AuctionNFT");
  const auctionNFT = await AuctionNFT.deploy("Celo NFTT", "CNFT", );
  await auctionNFT.deployed();
  console.log("AuctionNFT address deployed to:", auctionNFT.address);
}

main();