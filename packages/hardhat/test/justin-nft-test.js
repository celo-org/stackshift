const { expect } = require("chai");
// const { ethers } = require("ethers");

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

  it("should allow users to buy products", async function () {
    const productIndex = 0;
    const product = await nft.products(productIndex);

    // Purchase the product
    await nft.buyProduct(nft.address, productIndex, { value: product.price });

    // Check that the user has been minted an NFT
    const tokenId = await nft.getTokenId();
    expect(tokenId).to.equal(0);

    // Check that the token has the correct URI
    const tokenURI = await nft.tokenURI(tokenId);
    expect(tokenURI).to.equal("https://ipfs.io/ipfs/QmdfZ1zpmKEdS3QjbYzLULhm1H1KAkDe8C5NPh9ZXu8r61/nft1.json");
  });
});
