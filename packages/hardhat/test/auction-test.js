const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("DomainNameAuction", function () {
  let DomainNameAuction
  let domainNameAuction
  let owner
  let bidder1
  let bidder2

  beforeEach(async function () {
    [owner, bidder1, bidder2] = await ethers.getSigners()
    DomainNameAuction = await ethers.getContractFactory("DomainNameAuction")
    domainNameAuction = await DomainNameAuction.deploy()
    await domainNameAuction.deployed()
  })

  it("Should create an auction for a new domain", async function () {
    const domainName = "mydomain.com"
    const reservePrice = ethers.utils.parseEther("1.0")
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
  })

  it("Should allow bidders to place bids on an auction", async function () {
    const domainName = "mydomain.com";
    const reservePrice = ethers.utils.parseEther("1.0");
    const endTime = Math.floor(Date.now() / 1000) + 3600; // 1 hour from now
    await domainNameAuction.createAuction(domainName, reservePrice, endTime);

    await expect(domainNameAuction.connect(bidder1).bid(0, { value: ethers.utils.parseEther("1.5") }))

    const domain = await domainNameAuction.getAuction(0);
  })
})