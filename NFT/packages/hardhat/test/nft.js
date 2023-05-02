const { expect, u } = require("chai");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");

describe("Test 1", function () {
  it("should pass", async function () {
    const [owner, user1, user2, user3, user4] = await ethers.getSigners();

    const NFT = await ethers.getContractFactory("RNFT");
    const nft = await NFT.deploy(
      "https://baker.mypinata.cloud/ipfs/QmNwfJHjNKchyauLgcqBPYS2QiTKzzRDdsfKyprnMRJR1P/"
    );
    await nft.deployed();

    await nft.mint();
    await nft.connect(user1).mint();
    await nft.connect(user2).mint();
    await nft.connect(user3).mint();
    await nft.connect(user4).mint();

    console.log(await nft.tokenURI(0));
    console.log(await nft.tokenURI(1));
    console.log(await nft.tokenURI(2));
    console.log(await nft.tokenURI(3));
    console.log(await nft.tokenURI(4));
    console.log(await nft.tokenURI(5));

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  });
});
