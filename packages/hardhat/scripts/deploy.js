const hre = require("hardhat");

async function main() {
  //const SupportToken = await hre.ethers.getContractFactory("SupportToken");
  //const supportToken = await SupportToken.deploy();
  //await supportToken.deployed();
  //console.log("SupportToken address deployed to:", supportToken.address);

  const addy = "0x1640fd2cedF25FA119DCE206190547C18036e9Ce"

  const DoAuctions = await hre.ethers.getContractFactory("DoAuctions");
  const doAuctions = await DoAuctions.deploy(addy);
  await doAuctions.deployed();
  console.log("DoAuctions address deployed to:", doAuctions.address);
}



main();