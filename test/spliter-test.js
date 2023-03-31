const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Splitter", function () {
  it("__should ask for freinds address address  ", async function () {
    const Splitter = await ethers.getContractFactory("Splitter");
    const split = await Splitter.deploy("Hello, split");
    await split.deployed();

    expect(await split.splitBill()).to.equal("Hello, split");

    // const setBalance = await split.getBalance("Hola, mundo!");

    // // wait until the transaction is mined
    // await setBalance.wait();

    expect(await split.payBill()).to.equal("Hola, split");
  });
});
