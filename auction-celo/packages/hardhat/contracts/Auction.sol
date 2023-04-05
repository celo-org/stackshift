//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract Auction {
    // Auction details
    address public owner;
    string public item;
    uint256 public reservePrice;
    uint256 public auctionEndTime;

    // Bid details
    address public highestBidder;
    uint256 public highestBid;

    // Allowed withdrawals of previous bids
    mapping(address => uint256) public withdrawals;

    // Auction ended flag
    bool ended;

    // Events
    event HighestBidIncreased(address bidder, uint256 amount);
    event AuctionEnded(address winner, uint256 amount);

    // Constructor
    constructor(string _item, uint256 _reservePrice, uint256 _auctionEndTime) public {
        owner = msg.sender;
        item = _item;
        reservePrice = _reservePrice;
        auctionEndTime = now + _auctionEndTime;
    }

    // Bid function
    function bid() public payable {
        require(now <= auctionEndTime, "Auction has ended");
        require(msg.value > highestBid, "Bid must be higher than current highest bid");

        // Return previous bid amount to previous highest bidder
        if (highestBidder != 0x0) {
            withdrawals[highestBidder] += highestBid;
        }

        // Update highest bidder and highest bid amount
        highestBidder = msg.sender;
        highestBid = msg.value;

        // Emit event
        emit HighestBidIncreased(msg.sender, msg.value);
    }

    // Withdraw function
    function withdraw() public {
        uint256 amount = withdrawals[msg.sender];
        require(amount > 0, "No previous bid to withdraw");
        withdrawals[msg.sender] = 0;
        msg.sender.transfer(amount);
    }

    // End auction function
    function endAuction() public {
        require(msg.sender == owner, "Only the owner can end the auction");
        require(!ended, "Auction has already ended");

        // Set ended flag to true
        ended = true;

        // Emit event
        emit AuctionEnded(highestBidder, highestBid);

        // Transfer highest bid amount to owner
        owner.transfer(highestBid);
    }
}
