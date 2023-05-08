const hre = require("hardhat");

async function main() {
  const Auction = await hre.ethers.getContractFactory("Auction");
  const auction = await Auction.deploy("0xe865ff5D675F1dCaccD945f0b97Cb9D506596c90", 20, 500000000, 4, "0x6f40bB4d1E275e26C9B5419131e5CBAbF89CF535");
  await auction.deployed();
  console.log("Auction address deployed to:", auction.address);
}

main();