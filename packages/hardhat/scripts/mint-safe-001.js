async function main() {
  const [deployer] = await ethers.getSigners();

  // We get the contract to deploy
  const Membership = await hre.ethers.getContractFactory("JustinNFT");
  const membership = await Membership.attach(
    "0x6D801bF793248ecf9bC20d465246e9305311aDD5"
  );

  const res = await membership.safeMint(deployer.address, "silver.json");

  const ok = await res.wait();

  console.log(ok);
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });