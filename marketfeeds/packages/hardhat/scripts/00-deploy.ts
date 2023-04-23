const hre = require("hardhat");

const { WrapperBuilder } = require("@redstone-finance/evm-connector");

async function main() {
  const ExampleContractCustomUrls = await hre.ethers.getContractFactory(
    "ExampleContractCustomUrls"
  );
  let exampleContract = await ExampleContractCustomUrls.deploy();

  // await exampleContract.deployed();

  // const contractAddress = await (await exampleContract.deployed()).address;
  // console.log(`Contract was deployed to ${contractAddress}`);

  // console.log("EXAMPLE CONTRACTS DEPLOYED", exampleContract.address);

  exampleContract = WrapperBuilder.wrap(exampleContract).usingDataService(
    {
      dataServiceId: "redstone-custom-urls-demo",
      uniqueSignersCount: 2,
      dataFeeds: ["0x5b62caff15928ed4"],
    },
    ["https://d1zm8lxy9v2ddd.cloudfront.net"]
  );

  const valueFromOracle = await exampleContract.getValue();
  console.log({ valueFromOracle: valueFromOracle.toNumber() });
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
