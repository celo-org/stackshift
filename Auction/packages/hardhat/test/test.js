const { expect, assert } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Auction test", function () {
  async function deloy() {
    const provider = ethers.provider;
    const [owner, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();

    const Auction = await ethers.getContractFactory("AuctionContract");
    const auction = await Auction.deploy();
    await auction.deployed();

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }

    return {
      auction,
      user1,
      user2,
      user3,
      user4,
      user5,
      owner,
      provider,
      sleep,
    };
  }

  it("Should create a new auction", async function () {
    const { auction, user1, user2, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    const auctions = await auction.fetchAuctions();
    expect(auctions.length).to.equal(1);
  });
  it("Should be a able to bid manually on new auction", async function () {
    const { auction, user1, user2, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .bid(0, { value: ethers.utils.parseEther("30") });

    expect((await auction.connect(user1).fetchMyBids()).length).to.equal(1);
  });
  it("Should be a able to bid automatically on new auction", async function () {
    const { auction, user1, user2, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .automaticBid(
        0,
        ethers.utils.parseEther("30"),
        ethers.utils.parseEther("20"),
        { value: ethers.utils.parseEther("100") }
      );

    await auction.connect(user2).bid(0, {
      value: ethers.utils.parseEther("40"),
    });

    assert.equal((await auction.getWinner(0)).winner, user1.address);
  });
  it("Should be able to withdraw bid", async function () {
    const { auction, user1, user2, user3, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction.connect(user3).bid(0, {
      value: ethers.utils.parseEther("15"),
    });

    await auction
      .connect(user1)
      .automaticBid(
        0,
        ethers.utils.parseEther("30"),
        ethers.utils.parseEther("20"),
        { value: ethers.utils.parseEther("100") }
      );

    await auction.connect(user2).bid(0, {
      value: ethers.utils.parseEther("40"),
    });

    await auction.connect(user1).bidWithdraw(0);
    await auction.connect(user3).bidWithdraw(0);

    assert.equal(
      (await auction.connect(user1).AuctionBid(0, user1.address)).bid_amount,
      0
    );
    assert.equal(
      (await auction.connect(user1).AuctionBid(0, user1.address)).balance,
      100000000000000000000
    );
    assert.equal(
      (await auction.connect(user3).AuctionBid(0, user3.address)).balance,
      15000000000000000000
    );
  });
  it("Should be able to withdraw funds from auction contract", async function () {
    const { auction, user1, user2, user3, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction.connect(user3).bid(0, {
      value: ethers.utils.parseEther("15"),
    });

    await auction.connect(user3).bidWithdraw(0);

    const intialBalance = await provider.getBalance(user3.address);
    await auction.connect(user3).bidRefund(0);
    const newBalance = await provider.getBalance(user3.address);
    const balance = newBalance - intialBalance;
    assert.equal(Math.round(balance / 10 ** 18), 15);
  });
  it("Should be a able to get winner", async function () {
    const { auction, user1, user2, user3, user4, user5, provider } =
      await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .automaticBid(
        0,
        ethers.utils.parseEther("30"),
        ethers.utils.parseEther("20"),
        { value: ethers.utils.parseEther("100") }
      );

    await auction.connect(user2).bid(0, {
      value: ethers.utils.parseEther("40"),
    });

    await auction.connect(user3).bid(0, {
      value: ethers.utils.parseEther("60"),
    });

    await auction.connect(user4).bid(0, {
      value: ethers.utils.parseEther("85"),
    });

    assert.equal((await auction.getWinner(0)).winner, user1.address);
  });
  it("Should be able to get all auctions", async function () {
    const { auction, user1, user2, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .createAuction(
        "Art1",
        "Art1",
        ethers.utils.parseEther("10"),
        Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
        Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
        ethers.utils.parseEther("20"),
        "none",
        0
      );

    const auctions = await auction.fetchAuctions();
    expect(auctions.length).to.equal(2);
  });
  it("Should be able to get all auctions for a caller", async function () {
    const { auction, user1, user2, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .createAuction(
        "Art1",
        "Art1",
        ethers.utils.parseEther("10"),
        Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
        Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
        ethers.utils.parseEther("20"),
        "none",
        0
      );

    await auction
      .connect(user1)
      .createAuction(
        "Art2",
        "Art2",
        ethers.utils.parseEther("10"),
        Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
        Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
        ethers.utils.parseEther("20"),
        "none",
        0
      );

    const auctions = await auction.connect(user1).fetchMyAuctions();
    expect(auctions.length).to.equal(2);
  });
  it("Should be a able to get all bids made by a caller", async function () {
    const { auction, user1, user2, user3, provider } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction.createAuction(
      "Art1",
      "Art1",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-29 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .automaticBid(
        0,
        ethers.utils.parseEther("30"),
        ethers.utils.parseEther("20"),
        { value: ethers.utils.parseEther("100") }
      );

    await auction.connect(user2).bid(0, {
      value: ethers.utils.parseEther("40"),
    });

    await auction.connect(user3).bid(0, {
      value: ethers.utils.parseEther("60"),
    });

    await auction.connect(user2).bid(1, {
      value: ethers.utils.parseEther("70"),
    });

    await auction.connect(user3).bid(1, {
      value: ethers.utils.parseEther("80"),
    });

    await auction.connect(user2).bid(1, {
      value: ethers.utils.parseEther("100"),
    });

    const bids = await auction.connect(user2).fetchMyBids();
    expect(bids.length).to.equal(2);
  });
  /*  it("Auction owner should be able to withdraw fund", async function () {
    const {
      auction,
      owner,
      user1,
      user2,
      user3,
      user4,
      user5,
      provider,
      sleep,
    } = await loadFixture(deloy);

    await auction.createAuction(
      "Art",
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-25 17:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-26 16:40:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .automaticBid(
        0,
        ethers.utils.parseEther("30"),
        ethers.utils.parseEther("20"),
        { value: ethers.utils.parseEther("100") }
      );

    await auction.connect(user2).bid(0, {
      value: ethers.utils.parseEther("40"),
    });

    await auction.connect(user3).bid(0, {
      value: ethers.utils.parseEther("60"),
    });

    await auction.connect(user4).bid(0, {
      value: ethers.utils.parseEther("85"),
    });

    //await sleep(60000);

    const intialBalance = await provider.getBalance(owner.address);
    await auction.getAuctionFund(0);
    const newBalance = await provider.getBalance(owner.address);
    const balance = newBalance - intialBalance;
    console.log(balance);
    //assert.equal(Math.round(balance / 10 ** 18), 15);

    //assert.equal((await auction.getWinner(0)).winner, user1.address);
  }); */
});
