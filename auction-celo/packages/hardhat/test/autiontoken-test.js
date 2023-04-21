import { ethers } from "hardhat";
import { Signer } from "ethers";
import { expect } from "chai";

describe("AuctionToken", function () {
  let owner;
  let auctionToken;

  beforeEach(async function () {
    // Get the owner of the contract
    [owner] = await ethers.getSigners();

    // Deploy the AuctionToken contract
    const auctionTokenFactory = await ethers.getContractFactory(
      "AuctionToken",
      owner
    );
    AuctionToken = await auctionTokenFactory.deploy();

    // Wait for the contract to be mined
    await auction.deployed();
  });

  it("should mint 10000 tokens to the owner", async function () {
    const balance = await auctionToken.balanceOf(await owner.getAddress());
    expect(balance).to.equal(10000 * 10 ** 18);
  });

  it("should accept bid and update sentInBid variable", async function () {
    const BidAmount = 1000;

    // Send a Bid to the contract
    await owner.sendTransaction({
      to: AuctionToken.address,
      value: BidAmount,
    });

    // Check that the sentInBid variable has been updated correctly
    const sentInBid = await AuctionToken.sentInBid();
    expect(sentInBid).to.equal(BidAmount);
  });

  it("should withdraw Bid to owner's address", async function () {
    const BidAmount = 1000;

    // Send a Bid to the contract
    await owner.sendTransaction({
      to: AuctionToken.address,
      value: BidAmount,
    });

    // Get the initial balance of the owner's address
    const initialBalance = await owner.getBalance();

    // Withdraw the BidPriceamount to the owner's address
    await AuctionToken.withdrawChest();

    // Check that the owner's address balance has been updated correctly
    const expectedBalance = initialBalance.add(BidAmount);
    const actualBalance = await owner.getBalance();
    expect(actualBalance).to.equal(expectedBalance);
  });
});
