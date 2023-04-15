const { assert, expect } = require("chai");
const { ethers } = require("hardhat");
const { before } = require("mocha");
const { WrapperBuilder } = require("@redstone-finance/evm-connector");

before(async function () {
  const [deployer] = await ethers.getSigners();
  const Membership = await ethers.getContractFactory("JustinNFT");
  const membership = await Membership.deploy();
  await membership.deployed();

  this.membership = membership;
  this.deployer = deployer;
});

describe("Membership", function () {
  it("Should mint a new nft for user", async function () {
    const res = await this.membership.safeMint(
      this.deployer.address,
      "silver.json"
    );

    await res.wait();

    const balance = await this.membership.balanceOf(this.deployer.address);

    assert.equal(balance, 1);
  });

  it("Should confirm owner of token", async function () {
    const owner = await this.membership.ownerOf(0);
    assert.equal(owner, this.deployer.address);
  });

  it("Should confirm token URI", async function () {
    const tokenUri = await this.membership.tokenURI(0);

    assert.equal(
      tokenUri,
      "https://gateway.pinata.cloud/ipfs/Qme74zLzhAU7umzG2GG96wTPtogV5xh7pKGvBRUEFGxZHX/silver.json"
    );
  });

  it("Should update membership from Silver to Gold", async function () {
    const membershipRes = await fetch(
      "https://dynamic-nft-for-membership-card.vercel.app/membership/0x3472059945ee170660a9A97892a3cf77857Eba3A"
    );

    const body = await membershipRes.json();

    //When membership is upgraded Gold
    if (body.level === 1) {
      const wrappedContract = WrapperBuilder.wrap(
        this.membership
      ).usingDataService(
        {
          dataServiceId: "redstone-custom-urls-demo",
          uniqueSignersCount: 2,
          dataFeeds: ["0x51aef3f04920d8cb"],
        },
        ["https://d1zm8lxy9v2ddd.cloudfront.net"]
      );

      // Interact with the contract (getting oracle value securely)
      const res = await wrappedContract.updateMembership(0);

      await res.wait();

      const tokenUri = await this.membership.tokenURI(0);

      assert.equal(
        tokenUri,
        "https://gateway.pinata.cloud/ipfs/Qme74zLzhAU7umzG2GG96wTPtogV5xh7pKGvBRUEFGxZHX/gold.json"
      );
    }
  });
});