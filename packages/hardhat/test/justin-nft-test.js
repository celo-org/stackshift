const { expect } = require("chai");

describe("JustinNFT contract", function () {
  let JustinNFT;
  let nft;

  beforeEach(async function () {
    JustinNFT = await ethers.getContractFactory("JustinNFT");
    nft = await JustinNFT.deploy();
    await nft.deployed();
  });

  it("should have three products", async function () {
    const products = await nft.getProducts();
    expect(products.length).to.equal(3);
  });

  it("should mint a new token if the user hasn't minted before", async function () {
    const [signer] = await ethers.getSigners();
    const products = await nft.getProducts();
    const productIndex = 0;
    const product = products[productIndex];
  });



});
