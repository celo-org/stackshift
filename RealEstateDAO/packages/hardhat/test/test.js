const { expect, use } = require("chai");
const { ethers } = require("hardhat");
const { waffle } = require("hardhat");

describe("Test 1", function () {
  it("should pass", async function () {
    const [owner, user1, user2, user3, user4, user5, user6, user7] =
      await ethers.getSigners();

    const NFT = await ethers.getContractFactory("DAONFT");
    const nft = await NFT.deploy(
      "https://baker.mypinata.cloud/ipfs/QmUChQWWuW3HBxTfQu1DeuvdypyyPTLHUgWspzwkzZgqpN"
    );
    await nft.deployed();

    const DAO = await ethers.getContractFactory("DAO");
    const dao = await DAO.deploy(nft.address);
    await dao.deployed();

    await nft.addAddressToWhitelist(dao.address);

    await nft
      .connect(user1)
      .mintMany(1, { value: ethers.utils.parseEther("100") });
    await nft
      .connect(user2)
      .mintMany(1, { value: ethers.utils.parseEther("100") });
    await nft
      .connect(user3)
      .mintMany(1, { value: ethers.utils.parseEther("100") });
    await nft
      .connect(user4)
      .mintMany(1, { value: ethers.utils.parseEther("100") });
    await nft
      .connect(user5)
      .mintMany(1, { value: ethers.utils.parseEther("100") });

    await dao.createMortgage(
      "name",
      ethers.utils.parseEther("1"),
      "dddd",
      ethers.utils.parseEther("0.1"),
      user1.address,
      "desc",
      "image",
      ethers.utils.parseEther("100")
    );

    await dao
      .connect(user6)
      .createMortgage(
        "name",
        ethers.utils.parseEther("1"),
        "dddd",
        ethers.utils.parseEther("0.1"),
        user3.address,
        "desc",
        "image",
        ethers.utils.parseEther("100")
      );

    await dao
      .connect(user7)
      .createMortgage(
        "name",
        ethers.utils.parseEther("1"),
        "dddd",
        ethers.utils.parseEther("0.1"),
        user4.address,
        "desc",
        "image",
        ethers.utils.parseEther("100")
      );

    console.log(await dao.connect(user1).getMortgage());
    console.log(await dao.connect(user3).getMortgage());
    console.log(await dao.connect(user4).getMortgage());

    await dao.connect(user1).approveMort(0, 2);
    await dao.connect(user3).approveMort(1, 1);
    await dao.connect(user4).approveMort(2, 1);

    console.log(await dao.getProposals());

    await dao.connect(user1).voteOnProposal(0, 0);
    await dao.connect(user2).voteOnProposal(0, 1);
    await dao.connect(user3).voteOnProposal(0, 2);
    await dao.connect(user4).voteOnProposal(0, 2);
    await dao.connect(user5).voteOnProposal(0, 1);

    await dao.connect(user1).voteOnProposal(1, 0);
    await dao.connect(user2).voteOnProposal(1, 1);
    await dao.connect(user3).voteOnProposal(1, 0);
    await dao.connect(user4).voteOnProposal(1, 2);
    await dao.connect(user5).voteOnProposal(1, 0);

    await sleep(5000);

    await dao.connect(user1).executeProposal(1);

    await dao
      .connect(user7)
      .payLoan(1, { value: ethers.utils.parseEther("200") });

    console.log(await dao.repayment(user7.address, 1));

    await dao
      .connect(user2)
      .createMortgage(
        "name",
        ethers.utils.parseEther("1"),
        "dddd",
        ethers.utils.parseEther("0.1"),
        user4.address,
        "desc",
        "image",
        ethers.utils.parseEther("100")
      );

    await dao
      .connect(user4)
      .createMortgage(
        "name",
        ethers.utils.parseEther("1"),
        "dddd",
        ethers.utils.parseEther("0.1"),
        user4.address,
        "desc",
        "image",
        ethers.utils.parseEther("100")
      );

    await dao.connect(user1).voteOnProposal(2, 0);
    await dao.connect(user2).voteOnProposal(2, 1);
    await dao.connect(user3).voteOnProposal(2, 2);
    await dao.connect(user4).voteOnProposal(2, 2);
    await dao.connect(user5).voteOnProposal(2, 1);

    await dao.connect(user1).voteOnProposal(3, 0);
    await dao.connect(user2).voteOnProposal(3, 0);
    await dao.connect(user3).voteOnProposal(3, 0);
    await dao.connect(user4).voteOnProposal(3, 2);
    await dao.connect(user5).voteOnProposal(3, 1);

    await sleep(5000);

    await dao.connect(user3).executeProposal(3);

    await dao.connect(user1).createProposal("title", "desc");

    await dao.connect(user1).voteOnProposal(4, 0);
    await dao.connect(user2).voteOnProposal(4, 0);
    await dao.connect(user3).voteOnProposal(4, 0);
    await dao.connect(user4).voteOnProposal(4, 2);
    await dao.connect(user5).voteOnProposal(4, 1);

    console.log(await dao.getProposals());

    function sleep(ms) {
      return new Promise((resolve) => setTimeout(resolve, ms));
    }
  });
});
