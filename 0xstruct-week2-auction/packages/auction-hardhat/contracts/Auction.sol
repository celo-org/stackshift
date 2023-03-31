// SPDX-License-Identifier: MIT
pragma solidity ^0.8.3;

import "hardhat/console.sol";

// learning reference: https://www.bitdegree.org/learn/best-code-editor/solidity-simple-auction-example
// internalized to solidify learning
contract Auction {
    address payable public host;
    uint public endtime; // in seconds

    address public topBidder;
    uint256 public topBid;

    // keep track of bids in mapping
    mapping(address => uint256) public bids;

    bool public finished;

    // events
    event topBidIncreased(address bidder, uint256 bidAmount);
    event auctionFinished(address winner, uint256 bidAmount);

    /// duration in seconds from current block timestamp
    constructor(
        uint _duration
    ) {
        endtime = block.timestamp + _duration;
        host = payable(msg.sender);
        topBid = 0;
    }

    function bid() public payable {
        require(block.timestamp <= endtime, "Auction has already finished.");
        require(msg.value > topBid, "Your bid must be higher than the top bid.");

        if(topBid != 0) {
            // instead of sending back (due to potential risk)
            // let bidders withdraw
            // keep track of bids to be returned
            bids[topBidder] += topBid;
        }

        topBidder = msg.sender;
        topBid = msg.value;

        console.log("topBidder: %s / %s", topBidder, msg.sender);
        emit topBidIncreased(msg.sender, msg.value);
    }

    function withdraw() public returns (bool) {
        uint256 bidAmount = bids[msg.sender];

        if(bidAmount > 0) {
            // set zero in the mapping first
            // to prevent repeat withdrawals
            bids[msg.sender] = 0;

            if(!payable(msg.sender).send(bidAmount)) {
                // send unsuccessful, so set the amount in the mapping
                bids[msg.sender] = bidAmount;
                return false;
            }
        }

        return true;
    }

    /// Auction ends and highest bid is sent
    /// to the host.
    function finish() public payable {
        // It is a good practice to structure functions which interact
        // with other contracts (i.e. call functions or send Ether)
        // into three phases:
        // 1. check conditions
        // 2. perform actions (potentially change conditions)
        // 3. interact with other contracts
        // If these phases get mixed up, the other contract might call
        // back into the current contract and change the state or cause
        // effects (ether payout) to be done multiple times.
        // If functions that are called internally include interactions with external
        // contracts, they have to be considered interaction with
        // external contracts too.

        // 1. Conditions
        require(block.timestamp >= endtime, "Auction endtime hasn't been reached yet.");
        require(!finished, "Auction has already finished.");

        // 2. Effects
        finished = true;
        emit auctionFinished(topBidder, topBid);

        // 3. Interaction
        host.transfer(topBid);
    }

    function setEndtime() public {
        endtime = block.timestamp;
    }
}