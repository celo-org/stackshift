const hre = require("hardhat");

const main = async () => {
  
  const CrowdFund = await hre.ethers.getContractFactory("CrowdFund");
  const crowdFund = await CrowdFund.deploy("0x874069Fa1Eb16D44d622F2e0Ca25eeA172369bC1");

  await crowdFund.deployed();

  console.log("The CrowdFund contract was deployed to: ", crowdFund.address);
}

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