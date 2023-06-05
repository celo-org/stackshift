const { expect } = require("chai")
const { ethers } = require("hardhat")
const { loadFixture } = require("@nomicfoundation/hardhat-network-helpers");

describe("Token and Dao Contract", function () {

  const startTime = parseInt(Date.now() / 1000) + 10;
  const endTime = startTime + 86400;

  async function deployTokenDaoFixture() {
    // Token Contract Deployment
    const Token = await ethers.getContractFactory("Token")
    const [owner, member1, member2, member3] = await ethers.getSigners()
    const token = await Token.deploy()
    await token.deployed()

    // Dao Contract Deployment
    const Dao = await ethers.getContractFactory("TokenGatedDao")
    const dao = await Dao.deploy(token.address)
    await dao.deployed()

    return {Token, token, Dao, dao, owner, member1, member2, member3}
  }

  describe("Deployment", function(){
    it("It should assign the total number of supply to the owner", async function () {
      const { token, owner } = await loadFixture(deployTokenDaoFixture)
      const ownerBalance = await token.balanceOf(owner.address)
      expect(await token.totalSupply()).to.equal(ownerBalance)
    })
  })

  describe("Member", function () {

    it("It should add a new member", async function () {
      const { token, dao, member1 } = await loadFixture(deployTokenDaoFixture)
      await token.transfer(member1.address, 100)
      await dao.connect(member1).addMember()
      expect(await dao.memberCount()).to.equal(1)
    })

    it("It should revert if the member already exist", async function () {
      const { dao, member2 } = await loadFixture(deployTokenDaoFixture)
      expect(await dao.connect(member2).addMember()).to.revertedWith("Already a member")
    })

     it("Should return true if is a member", async function () {
       const { token, dao, member1 } = await loadFixture(deployTokenDaoFixture)
        await token.transfer(member1.address, 100)
        await dao.connect(member1).addMember()
       expect(await dao.getMemberStatus(member1.address)).to.equal(true)

    })

    it("It should revert if the address is an invalid address", async function () {
      const { dao } = await loadFixture(deployTokenDaoFixture)  
        expect(await dao.addMember(), {from: ethers.constants.AddressZero}).to.revertedWith("Invalid address")
    })

     it("Should emit AddMember event", async function () {
       const { dao, member1 } = await loadFixture(deployTokenDaoFixture)  
       //We use connect to send a transaction from another account
        expect(await dao.connect(member1).addMember()).to.emit(dao, "AddMember").withArgs(member1, 100)
    })

  })

  describe("Proposal", function () {
    it("Should create a new proposal and get the created proposal detail",async function () {
      const { token, dao, member1 } = await loadFixture(deployTokenDaoFixture)  
      await token.transfer(member1.address, 100);
      await dao.connect(member1).addMember();

      await dao.connect(member1).createProposal("Test Proposal", "This is a test proposal", startTime, endTime);
      
      // Get the proposal by the index
      expect(await dao.connect(member1).proposalCount()).to.equal(1);
      const [creator, title, description, start, end, yesVotes, noVotes] = await dao.getProposal(0);
      expect(creator).to.equal(member1.address);
      expect(title).to.equal("Test Proposal");
      expect(description).to.equal("This is a test proposal");
      expect(start).to.equal(startTime);
      expect(end).to.equal(endTime);
      expect(yesVotes).to.equal(0);
      expect(noVotes).to.equal(0);

    })

    it("should not create a new proposal if the member does not hold tokens", async function () {
      const { dao, member1 } = await loadFixture(deployTokenDaoFixture)  
      await dao.connect(member1).addMember();

      const startTime = parseInt(Date.now() / 1000) + 3600;
      const endTime = startTime + 86400;

      await expect(dao.connect(member1).createProposal("Test Proposal", "This is a test proposal", startTime, endTime)).to.be.revertedWith(
        "You must hold tokens to create a proposal"
      );
    });

    it("should not create a new proposal if the member is not a member of the community", async function () {
      const { token, dao, member1 } = await loadFixture(deployTokenDaoFixture)  
      await token.transfer(member1.address, 100);

      const startTime = parseInt(Date.now() / 1000) + 3600;
      const endTime = startTime + 86400;

      await expect(dao.createProposal("Test Proposal", "This is a test proposal", startTime, endTime)).to.be.revertedWith(
        "You are not yet a member of this community"
      );
    });
  });
    

  describe("Vote", function () {

    it("Should revert if voting has not started", async function () {
      const { token, dao, owner, member1, member2 } = await loadFixture(deployTokenDaoFixture)  
      await dao.connect(member1).addMember()
      await dao.connect(member2).addMember()
      await token.connect(owner).transfer(member1.address, 100)
      await token.connect(owner).transfer(member2.address, 100)
      await dao.connect(member1).createProposal("proposal title", "proposal description", startTime, endTime)
      setTimeout(async function() {
        expect(await dao.connect(member2).vote(0, 1)).to.be.revertedWith("Voting has not started yet")
      }, 10000)
    })

    it("Should not be able to vote if not  registered member of the community", async function () {
      const { token, dao, owner, member1, member2 } = await loadFixture(deployTokenDaoFixture)  
      await dao.connect(member1).addMember()
      await token.connect(owner).transfer(member1.address, 100)
      await token.connect(owner).transfer(member2.address, 100)
      await dao.connect(member1).createProposal("proposal title", "proposal description", startTime, endTime)
      setTimeout(async function() {
        expect(await dao.connect(member2).vote(0, 1)).to.be.revertedWith("You are not yet a member of this community")
      }, 10000)
    })

     it("Should not vote on a proposal more than once", async function () {
      const { token, dao, owner, member1, member2 } = await loadFixture(deployTokenDaoFixture)  
       await dao.connect(member1).addMember()
      await dao.connect(member2).addMember()
      await token.connect(owner).transfer(member1.address, 100)
      await token.connect(owner).transfer(member2.address, 100)
      await dao.connect(member1).createProposal("proposal title", "proposal description", startTime, endTime)
       setTimeout(async function () {
        await dao.connect(member2).vote(0, 1)
        expect(await dao.connect(member2).vote(0, 1)).to.be.revertedWith("You have already voted for this proposal")
      }, 30000)
    })

    it("Should not be able to vote if member does not have a token", async  function () {
      const { token, dao, owner, member1, member2 } = await loadFixture(deployTokenDaoFixture)  
      await dao.connect(member1).addMember()
      await dao.connect(member2).addMember()
      await token.connect(owner).transfer(member1.address, 100)
      await dao.connect(member1).createProposal("proposal title", "proposal description", startTime, endTime)
      setTimeout(async function() {
        expect(await dao.connect(member2).vote(0, 1)).to.be.revertedWith("You must hold tokens to vote")
      }, 30000)
      
    })
    
  })
  

})