var HelloWorld = artifacts.require("HelloWorld");
var SplitBill = artifacts.require("SplitBill");

module.exports = function (deployer) {
  deployer.deploy(HelloWorld);
  deployer.deploy(SplitBill);
};
