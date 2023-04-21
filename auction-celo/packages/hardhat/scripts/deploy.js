// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// When running the script with `npx hardhat run <script>` you'll find the Hardhat
// Runtime Environment's members available in the global scope.
const hre = require("hardhat");

async function main() {
  // Hardhat always runs the compile task when running scripts with its command
  // line interface.
  //
  // If this script is run directly using `node` you may want to call compile
  // manually to make sure everything is compiled
  // await hre.run('compile');

  // We get the contract to deploy
  //   const Greeter = await hre.ethers.getContractFactory("Greeter");
  //   const greeter = await Greeter.deploy("Hello, Hardhat!");

  //   await greeter.deployed();

  //   console.log("Greeter deployed to:", greeter.address);

  // const ERC721 = await hre.ethers.getContractFactory("ERC721");
  // const erc721 = await ERC721.deploy();

  // await erc721.deployed();

  // console.log("contract erc721 deployed to:", erc721.address);
  const erc721Address = "0x102ffcBb0377005bE2e1E3891159CFD24C0d76F3";

  const ProductAuction = await hre.ethers.getContractFactory("ProductAuction");
  const productAuction = await ProductAuction.deploy(erc721Address, 88, 1);

  await productAuction.deployed();

  console.log("Product Auction:", productAuction.address);

  // const AuctionnToken = await hre.ethers.getContractFactory("AuctionnToken");
  // const autionn = await AuctionnToken.deploy();

  // await autionn.deployed();

  // console.log("Auction deployed to:", autionn.address);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
