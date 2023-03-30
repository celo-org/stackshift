// SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

contract Auction {
address payable public owner;
uint256 public auctionEndTime;
address public highestBidder;
uint256 public highestBid;

mapping(address => uint256) public bids;

bool ended;

event HighestBidIncreased(address bidder, uint256 amount);
event AuctionEnded(address winner, uint256 amount);

constructor() {
    owner = payable(msg.sender);
    auctionEndTime = block.timestamp + 2 minutes;
}

function bid() public payable {
    require(
        block.timestamp <= auctionEndTime,
        "Auction already ended."
    );
    require(
        msg.value > highestBid,
        "There already is a higher bid."
    );

    if (highestBid != 0) {
        bids[highestBidder] += highestBid;
    }

    highestBidder = msg.sender;
    highestBid = msg.value;
    emit HighestBidIncreased(msg.sender, msg.value);
}

function endAuction() public payable {
    // require(msg.sender == owner, "You are not the owner");
    require(
        block.timestamp >= auctionEndTime,
        "Auction not yet ended."
    );
    require(!ended, "Auction already ended.");

    ended = true;
    emit AuctionEnded(highestBidder, highestBid);
   
    (bool sent,) = owner.call{value: highestBid}("");
    require(sent, "Failed to send Ether");

}

function getHighestBidderAddress() public view returns(address _highestBidder){
    return highestBidder;
}

function getOwnerBalance() public view returns(uint256 _balance){
    return owner.balance;
}

function getEndTime() public view returns(uint256) {
    return auctionEndTime;
}

function getBidderAmount(uint256)
    public
    view
    returns (uint256){
    return bids[msg.sender];
}

function refund() external{
      require(
        block.timestamp >= auctionEndTime,
        "Auction not yet ended."
    );
    (bool sent,) = msg.sender.call{value: bids[msg.sender]}("");
    require(sent, "Failed to send Ether");
}

function updateEndtime(uint256 newEndtime) public{
  auctionEndTime = block.timestamp + newEndtime;
}

}
