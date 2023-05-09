const hre = require("hardhat");

const { WrapperBuilder } = require("@redstone-finance/evm-connector");

const main = async () => {

  const contractAddress = "0xF9BA9DD16A8a58F8727A769FF487CD0855Cd39AF";
  
  const CustomDataFeed = await hre.ethers.getContractAt("CustomDataFeed", contractAddress);
  const membership = await CustomDataFeed.attach(
    "0x6f40bB4d1E275e26C9B5419131e5CBAbF89CF535"
  );
  

  const wrappedContract = WrapperBuilder.wrap(contract).usingDataService(
    {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["ETH", "BTC"],
    },
    ["https://d33trozg86ya9x.cloudfront.net"]
  );

  // Interact with the contract (getting oracle value securely)
  const res = await wrappedContract.updateMembership(0);

  await res.wait();

  const tokenUri = await membership.tokenURI(0);

  console.table({ tokenUri });
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