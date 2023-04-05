// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

contract AuctionnToken {


    address payable public seller;
    uint public price;
    uint public highestBid;
    address payable public highestBidder;
    mapping(address => uint) public balances;
    bool public ended;
    
    event HighestBidIncreased(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);
    
    constructor() {
        seller = payable(msg.sender);
        price = 100; // Set the price of the product to 100
    }
    
    function bid() public payable {
        require(msg.value > highestBid, "There is already a higher or equal bid.");
        require(!ended, "The auction has ended.");
        
        if (highestBidder != address(0)) {
            balances[highestBidder] += highestBid;
        }
        
        highestBidder = payable(msg.sender);
        highestBid = msg.value;
        emit HighestBidIncreased(highestBidder, highestBid);
    }
    
    function endAuction() public {
        require(msg.sender == seller, "You are not authorized to end this auction.");
        require(!ended, "The auction has already ended.");
        
        ended = true;
        emit AuctionEnded(highestBidder, highestBid);
        
        seller.transfer(highestBid); // Transfer the funds to the seller
    }
    
    function withdraw() public {
        require(balances[msg.sender] > 0, "You have no balance to withdraw.");
        
        uint amount = balances[msg.sender];
        balances[msg.sender] = 0;
        
        payable(msg.sender).transfer(amount); // Transfer the funds to the bidder
    }
    
}
