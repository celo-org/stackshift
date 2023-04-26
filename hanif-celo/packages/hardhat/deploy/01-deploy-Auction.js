await deploy("Auction", {
  from: deployer,
  args: [],
  log: true,
});

module.exports.tags = ["Auction"];
