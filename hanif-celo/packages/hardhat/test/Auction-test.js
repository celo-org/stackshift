const Auction = artifacts.require("Auction");

contract("Auction", accounts => {
  it("should start auction", async () => {
    const auction = await Auction.deployed();
    await auction.startAuction();
    const state = await auction.state();
    assert.equal(state, 1, "Auction should be active");
  });
});

 it("should place bid", async () => {
    const auction = await Auction.deployed();
    await auction.startAuction();
    const startingBalance = await web3.eth.getBalance(accounts[1]);
    const amount = web3.utils.toWei("1", "ether");
    await auction.placeBid({ from: accounts[1], value: amount });
    const endingBalance = await web3.eth.getBalance(accounts[1]);
    assert(endingBalance < startingBalance - amount, "Bid was not placed");
  });

  it("should withdraw bid", async () => {
    const auction = await Auction.deployed();
    await auction.startAuction();
    const startingBalance = await web3.eth.getBalance(accounts[1]);
    const amount = web3.utils.toWei("1", "ether");
    await auction.placeBid({ from: accounts[1], value: amount });
    await auction.withdrawBid({ from: accounts[1] });
    const endingBalance = await web3.eth.getBalance(accounts[1]);
    assert(endingBalance >= startingBalance - amount, "Bid was not withdrawn");
  });

  it("should end auction", async () => {
    const auction = await Auction.deployed();
    await auction.startAuction();
    const amount = web3.utils.toWei("1", "ether");
    await auction.placeBid({ from: accounts[1], value: amount });
    await auction.placeBid({ from: accounts[2], value: amount });
    await auction.endAuction();
    const winner = await auction.highestBidder();
    const balance = await web3.eth.getBalance(auction.address);
    assert(winner == accounts[2], "Wrong winner");
    assert(balance == 0, "Balance not transferred to owner");
  });