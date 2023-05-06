require("dotenv").config();
const hre = require("hardhat");
const { WrapperBuilder } = require("redstone-evm-connector");

async function main() {
  const CoinBet = await ethers.getContractFactory("CoinBet");
  let contract = await CoinBet.deploy({
    value: ethers.utils.parseEther("1"),
  });
  await contract.deployed();
  console.log("CustomUrls deployed to:", contract.address);

  contract = WrapperBuilder.wrapLite(contract).usingPriceFeed("redstone", {
    asset: "ENTROPY",
  });

  await contract.authorizeProvider();
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
