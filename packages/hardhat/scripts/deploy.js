const hre = require("hardhat");

const main = async () => {
  
  // const GamifiedOnChainNFT = await hre.ethers.getContractFactory("GamifiedOnChainNFT");
  // const gamifiedOnChainNFT = await GamifiedOnChainNFT.deploy();

  // await gamifiedOnChainNFT.deployed();

  // console.log("The GamifiedOnChainNFT contract was deployed to: ", gamifiedOnChainNFT.address);

  const contractAddress = "0xd684d703dbF259DC9F1e1bEF6dF905a7E85ACbc8";
  const myOnChainNFT = await hre.ethers.getContractAt("GamifiedOnChainNFT", contractAddress);
  
  // const mintNFT = await myOnChainNFT.mint();

  // console.log("NFT hash:", mintNFT.hash);

  const playWithNFT = await myOnChainNFT.play(1);

  console.log("Played hash:", playWithNFT.hash);
};

const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

runMain();