const NFT = artifacts.require("./NFT.sol");

module.exports = function (deployer) {
  deployer.deploy(NFT);
};
