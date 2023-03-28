const { ethers } = require("hardhat");

async function main() {

  const spliterContract = await ethers.getContractFactory("BillSpliter");

  const deployedSpilterContract = await spliterContract.deploy();

  await deployedSpilterContract.deployed();

  console.log("Spliter Contract Address:", deployedSpilterContract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });