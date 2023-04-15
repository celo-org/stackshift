async function main() {
  const [deployer] = await ethers.getSigners();
  const { WrapperBuilder } = require("@redstone-finance/evm-connector");

  // We get the contract to deploy
  const Membership = await hre.ethers.getContractFactory("JustinNFT");
  const membership = await Membership.attach(
    "0x6D801bF793248ecf9bC20d465246e9305311aDD5"
  );

  const wrappedContract = WrapperBuilder.wrap(membership).usingDataService(
    {
      dataServiceId: "redstone-custom-urls-demo",
      uniqueSignersCount: 2,
      dataFeeds: ["0x51aef3f04920d8cb"],
    },
    ["https://d1zm8lxy9v2ddd.cloudfront.net"]
  );

  // Interact with the contract (getting oracle value securely)
  const res = await wrappedContract.updateMembership(0);

  await res.wait();

  const tokenUri = await membership.tokenURI(0);

  console.table({ tokenUri });
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });