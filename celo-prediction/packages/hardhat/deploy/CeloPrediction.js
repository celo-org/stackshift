require("dotenv").config();
const { ethers } = require("ethers");
const hre = require("hardhat");
const { WrapperBuilder } = require("redstone-evm-connector");

async function main() {
  // We get the contract to deploy
  const CeloPrediction = await hre.ethers.getContractFactory(
    "CeloPrediction"
  );
  const contract = await CeloPrediction.deploy({
    value: ethers.utils.parseEther("2"),
  });

  await contract.deployed();

  // This part to be precise
  wrappedContract = WrapperBuilder.wrapLite(contract).usingPriceFeed(
    "redstone",
    { asset: "ENTROPY" }
  );
  // And this part
  await wrappedContract.authorizeProvider();

  console.log("CeloPrediction deployed to:", contract.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });