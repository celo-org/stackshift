const GravatarRegistry = artifacts.require('./GravatarRegistry.sol')

module.exports = async function(deployer) {
  const registry = await GravatarRegistry.deployed()

  console.log('Account address:', registry.address)

  let accounts = await web3.eth.getAccounts()
  console.log('Accounts', accounts)
  await registry.createGravatar('Carl', 'https://thegraph.com/img/team/team_04.png', {
    from: accounts[0],
  })
}
