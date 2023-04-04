const { ethers } = require("hardhat");
const { expect } = require("chai");
const { time } = require("@nomicfoundation/hardhat-network-helpers");

let Auction;
let auction;
let host;
let bidder1;
let bidder2;

const THREE_MINS_IN_SECS = 180;

// Before each test, deploy the contract and transfer ETH to it
beforeEach(async function () {
    // Contracts are deployed using the first signer/account by default
    [host, bidder1, bidder2] = await ethers.getSigners();

    console.log("host addr: ", host.address);
    console.log("bidder1 addr: ", bidder1.address);
    console.log("bidder2 addr: ", bidder2.address);

    Auction = await ethers.getContractFactory("Auction");
    auction = await Auction.deploy(THREE_MINS_IN_SECS);
    await auction.deployed();
    console.log("contract addr: ", auction.address);

    console.log("host: ", await auction.host());
    console.log("endtime: ", await auction.endtime());
});

describe("Bidding with multiple bidders", function () {
    it("...", async function () {
        console.log("bidder1 bids 0.001");
        await auction.connect(bidder1).bid({ value: ethers.utils.parseEther("0.001") });

        console.log("topBidder: ", await auction.topBidder());
        console.log("topBid: ", await auction.topBid());
        //expect(await auction.topBidder()).to.equal(bidder1.address);
        //expect(await auction.topBid()).to.equal(ethers.utils.parseEther("0.001"));

        console.log("bidder2 bids 0.0015");
        await auction.connect(bidder2).bid({ value: ethers.utils.parseEther("0.0015") });

        console.log("topBidder: ", await auction.topBidder());
        console.log("topBid: ", await auction.topBid());

        // //expect(await auction.topBidder()).to.equal(bidder2.address);
        // //expect(await auction.topBid()).to.equal(ethers.utils.parseEther("0.0015"));

        // console.log("bidder1 bids same 0.0015 - should be rejected");
        // await expect(
        //     auction.connect(bidder1).bid({ value: ethers.utils.parseEther("0.0015") })
        //         .to.be.revertedWith("Your bid must be higher than the top bid.")
        // );

        console.log("bidder1 bids 0.0018");
        await auction.connect(bidder1).bid({ value: ethers.utils.parseEther("0.0018") });

        console.log("topBidder: ", await auction.topBidder());
        console.log("topBid: ", await auction.topBid());

        // topBidder is still bidder2
        // console.log("top bidder should still be bidder2");
        // expect(await auction.topBidder()).to.equal(bidder2.address);
        // expect(await auction.topBid()).to.equal(ethers.utils.parseEther("0.0015"));


        // fastforwarding time only compatible with hardhat
        // await time.increase(THREE_MINS_IN_SECS);

        // set auction to finished
        await auction.setEndtime(); // set Endtime to now
        await auction.finish();

        console.log("auction has finished?", await auction.finished());

        await expect(auction.connect(bidder2).bid({ value: ethers.utils.parseEther("0.002") })).to.be.revertedWith("Auction has already finished.");
        console.log("auction has finished?", await auction.finished());
    });
});
