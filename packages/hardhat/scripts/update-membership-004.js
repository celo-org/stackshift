async function main() {
  const [deployer] = await ethers.getSigners();
  const { WrapperBuilder } = require("@redstone-finance/evm-connector");

  // We get the contract to deploy
  const JustinNFT = await hre.ethers.getContractFactory("JustinNFT");
  const justinNFT = await JustinNFT.attach(
    "0x9Edd3fb21e1BC3dBE3c5BCf8AB8044c706AAEA9C"
  );

  const wrappedContract = WrapperBuilder.wrap(JustinNFT).usingDataService(
    {
      dataServiceId: "redstone-custom-urls-demo",
      uniqueSignersCount: 2,
      dataFeeds: ["0xf2384121b725bca1"],
    },
    ["https://d1zm8lxy9v2ddd.cloudfront.net"]
  );

  // Interact with the contract (getting oracle value securely)
  const res = await wrappedContract.buyProduct('0x5484a1D712b6135d528beE0AF308C026fa819a51', 0);

  //await res.wait();

  console.table({ res });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });