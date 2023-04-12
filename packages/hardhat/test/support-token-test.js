import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("SupportToken", function () {
  let owner;
  let supportToken;

  beforeEach(async function () {
    // Get the owner of the contract
    [owner] = await ethers.getSigners();

    // Deploy the SupportToken contract
    const supportTokenFactory = await ethers.getContractFactory(
      "SupportToken",
      owner
    );
    supportToken = await supportTokenFactory.deploy();

    // Wait for the contract to be mined
    await supportToken.deployed();
  });

  it("should mint 10000 tokens to the owner", async function () {
    const balance = await supportToken.balanceOf(await owner.getAddress());
    expect(balance).to.equal(10000 * 10 ** 18);
  });

  it("should accept donation and update sentIn variable", async function () {
    const donationAmount = 1000;

    // Send a donation to the contract
    await owner.sendTransaction({
      to: supportToken.address,
      value: donationAmount,
    });

    // Check that the sentIn variable has been updated correctly
    const sentIn = await supportToken.sentIn();
    expect(sentIn).to.equal(donationAmount);
  });

  it("should withdraw donation to owner's address", async function () {
    const donationAmount = 1000;

    // Send a donation to the contract
    await owner.sendTransaction({
      to: supportToken.address,
      value: donationAmount,
    });

    // Get the initial balance of the owner's address
    const initialBalance = await owner.getBalance();

    // Withdraw the donation to the owner's address
    await supportToken.withdrawChest();

    // Check that the owner's address balance has been updated correctly
    const expectedBalance = initialBalance.add(donationAmount);
    const actualBalance = await owner.getBalance();
    expect(actualBalance).to.equal(expectedBalance);
  });
});