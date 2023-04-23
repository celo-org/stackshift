const hre = require("hardhat");
import fs from "fs";

async function main() {
  const nftContract = await deployContract("ExampleNFT");
  const marketplaceContract = await deployContract("StableMarketplace");

  // Update JSON file with addresses
  updateAddressesFile({
    nft: nftContract.address,
    marketplace: marketplaceContract.address,
  });
}

async function deployContract(name: string) {
  console.log(`Deploying contract: ${name}`);
  const ContractFactory = await hre.ethers.getContractFactory(name);
  const deployedContract = await ContractFactory.deploy();
  console.log(
    `Deploy tx sent: ${deployedContract.address}. Waiting for confirmation...`
  );
  await deployedContract.deployed();
  console.log(`Deploy tx confirmed`);
  return deployedContract;
}

function updateAddressesFile(addresses: { nft: string; marketplace: string }) {
  const addressesFilePath = `./src/config/${hre.network.name}-addresses.json`;
  console.log(`Saving addresses to ${addressesFilePath}`);
  fs.writeFileSync(
    addressesFilePath,
    JSON.stringify(addresses, null, 2) + "\n"
  );
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
