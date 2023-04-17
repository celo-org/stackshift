const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Auction test", function () {
  it("Should create a new auction", async function () {
    const provider = ethers.provider;
    const [owner, user1, user2, user3, user4, user5, user6] =
      await ethers.getSigners();

    console.log(user1.address, user2.address, user3.address);
    const Auction = await ethers.getContractFactory("AuctionContract");
    const auction = await Auction.deploy();
    await auction.deployed();

    await auction.createAuction(
      "Art",
      ethers.utils.parseEther("10"),
      Math.floor(new Date("2023-04-17 14:00:00").getTime() / 1000),
      Math.floor(new Date("2023-04-17 21:00:00").getTime() / 1000),
      ethers.utils.parseEther("20"),
      "none",
      0
    );

    await auction
      .connect(user1)
      .bid(0, { value: ethers.utils.parseEther("10") });

    await auction
      .connect(user2)
      .automaticBid(
        0,
        ethers.utils.parseEther("20"),
        ethers.utils.parseEther("20"),
        {
          value: ethers.utils.parseEther("100"),
        }
      );

    await auction
      .connect(user3)
      .bid(0, { value: ethers.utils.parseEther("30") });
    await auction
      .connect(user3)
      .bid(0, { value: ethers.utils.parseEther("30") });

    await auction.connect(user3).bidWithdraw(0);

    console.log(await auction.fetchAuctions());
    console.log(await auction.AuctionBid(0, user3.address));
    //console.log(await auction.AuctionBid(0, user2.address));

    console.log(await auction.connect(user1).fetchMyBids());
    console.log(await auction.fetchMyAuctions());
    //console.log(await auction.getWinner(0));
  });
});
