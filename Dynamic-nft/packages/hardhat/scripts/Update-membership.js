async function main() {
  const [deployer] = await ethers.getSigners()
  const { WrapperBuilder } = require('@redstone-finance/evm-connector')

  // We get the contract to deploy
  const Membership = await hre.ethers.getContractFactory('Membership')
  const membership = await Membership.attach(
    '0xA39EaF77c0524417F5D6261A3267c40d8036c9AF',
  )

  const wrappedContract = WrapperBuilder.wrap(membership).usingDataService(
    {
      dataServiceId: 'redstone-custom-urls-demo',
      uniqueSignersCount: 2,
      dataFeeds: ['0x1774675b9bc5ae5c'],
    },
    ['https://d1zm8lxy9v2ddd.cloudfront.net'],
  )

  // Interact with the contract (getting oracle value securely)
  const res = await wrappedContract.updateMembership(0)

  await res.wait()

  const tokenUri = await membership.tokenURI(0)

  console.table({ tokenUri })
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
