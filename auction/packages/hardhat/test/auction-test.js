const { expect } = require("chai");
const { ethers } = require("hardhat");
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

let Auction;
let auction;
let owner;
let addr1;
let addr2;
let addrs;

// Before each test, deploy the contract and transfer ETH to it
    beforeEach(async function () {
        Auction = await ethers.getContractFactory('Auction');
        // [owner, addr1, addr2, ...addrs] = await ethers.getSigners();
        auction = await Auction.deploy();
      await auction.deployed();
      [owner, addr1, addr2, ...addrs] = await ethers.getSigners();

        await addr2.sendTransaction({
        to: auction.address,
        value: ethers.utils.parseEther('1.0'),
        });
    });

    // Test the bidding functionality of the contract
    describe('Bid', function () {
        it('Should be able to place a bid', async function () {
        await auction.connect(addr2).bid({value: ethers.utils.parseEther('1.5') });
        expect(await auction.highestBidder()).to.equal(addr2.address);
        expect(await auction.highestBid()).to.equal(ethers.utils.parseEther('1.5'));
        });

        it('Should not be able to place a bid after the auction has ended', async function () {
        await auction.connect(addr2).endAuction();
        await expect(auction.connect(addr2).bid({ value: ethers.utils.parseEther('1.5') })).to.be.revertedWith('Auction already ended.');
        });

        it('Should not be able to place a bid lower than the current highest bid', async function () {
        await expect(auction.connect(addr2).bid({ value: ethers.utils.parseEther('0.5') })).to.be.revertedWith('There already is a higher bid.');
        });
    });

    // Test the auction end functionality of the contract
    describe('End Auction', function () {
        it('Should be able to end the auction and transfer funds to beneficiary', async function () {
        const balanceBefore = await ethers.provider.getBalance(addr1.address);
        await auction.connect(addr2).bid({ value: ethers.utils.parseEther('1.5') });
        await auction.endAuction();
        const balanceAfter = await ethers.provider.getBalance(addr1.address);

        expect(await auction.ended()).to.equal(true);
        expect(await auction.highestBidder()).to.equal(addr2.address);
        expect(balanceAfter.sub(balanceBefore)).to.equal(ethers.utils.parseEther('1.5'));
        });

        it('Should not be able to end the auction before the bidding time has elapsed', async function () {
        await expect(auction.endAuction()).to.be.revertedWith('Auction not yet ended.');
        });

        it('Should not be able to end the auction more than once', async function () {
        await auction.connect(addr2).bid({ value: ethers.utils.parseEther('1.5') });
        await auction.endAuction();
        await expect(auction.endAuction()).to.be.revertedWith('Auction already ended.');
        });
    });
