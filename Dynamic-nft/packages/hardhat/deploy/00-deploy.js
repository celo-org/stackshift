module.exports = async ({ getNamedAccounts, deployments }) => {
  const { deploy } = deployments
  const { deployer } = await getNamedAccounts()

  await deploy('Membership', {
    from: deployer,
    args: [],
    log: true,
  })
}

module.exports.tags = ['Membership']
