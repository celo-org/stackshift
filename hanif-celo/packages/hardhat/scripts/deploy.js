const { ethers } = require('hardhat');
const { ContractKit } = require('@celo/contractkit');

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log('Deploying contracts with the account:', deployer.address);

  const kit = ContractKit.newKit(process.env.CELO_NETWORK);
  kit.addAccount(process.env.PRIVATE_KEY);

  const Auction = await ethers.getContractFactory('Auction');
  const auction = await Auction.deploy(1000000000000000000, 600, { gasLimit: 5000000 });

  console.log('Auction contract deployed to address:', auction.address);
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });