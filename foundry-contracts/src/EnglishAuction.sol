// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol"; //! remove later

contract EnglishAuction {
    struct Auction {
        string name; //name of the auction
        address payable actioneer; //who is conducting it
        uint leastAcceptableBid;
        Bidder highestBidder;
        uint duration; //period for which the acution will run
        mapping(address => Bidder) bids; //! what if the caller already has bid placed?
    }

    struct Bidder {
        address bidder;
        uint amount;
    }

    struct MetaData {
        string itemImage;
        string itemUri;
    }

    //using ids for keep track of the auctions
    mapping(uint => Auction) auctions;

    uint auctionCount;

    //keep track of the highest bidder
    // id of auction => bidders
    // mapping(uint => mapping(uint => uint)) highestBids;

    /// @notice place a bid
    /// @param _id id of the auction
    function placeBid(uint _id) public payable returns (bool success) {
        // //check 1. amout greater than least acceptable
        // require(
        //     msg.value > auctions[_id].leastAcceptableBid,
        //     "amount less than the least acceptable by auctioneer"
        // );
        // //check 2. deadline hasn't passed
        // require(isTimeLeft(_id), "auction period over");

        Bidder memory bidder = Bidder(msg.sender, msg.value);

        console.log("his value", msg.value); // ! REMOVE LATER

        //add to the bids mapping
        auctions[_id].bids[msg.sender] = bidder;

        //if amount greater than highest bid, replace highest bid
        if (msg.value > auctions[_id].highestBidder.amount) {
            auctions[_id].highestBidder = bidder;
        }

        success = true;
    }

    /// @notice revoke a bid
    /// @param _id auction id
    function revokeBid(uint _id) public {
        //remove him from the bids
        //if he was highest bidder, remove him,
        //chck that the time hasn't elapsed
    }

    ///@notice refund unsuccessful bidders if the time has elapased
    function refundBidder() public {}

    ///@param _id auction id
    function timeRemaining(uint _id) public view returns (uint timeLeft) {
        if (isTimeLeft(_id)) {
            timeLeft = block.timestamp / 1 days - auctions[_id].duration;
        }
        timeLeft = 0;
    }

    /*
     * ADMING FUNCTIONS
     */
    /// @dev create a new auction
    /// @param name auction name
    /// @param leastAcceptableBid least amount the acutioneer is willing to accepter
    /// @param duration time period in days the auction will be active
    function createAuction(
        string calldata name,
        uint leastAcceptableBid,
        uint duration
    ) public {
        auctionCount++;

        //set the caller as the auctioneer
        auctions[auctionCount].actioneer = payable(msg.sender);
        auctions[auctionCount].name = name;
        auctions[auctionCount].leastAcceptableBid = leastAcceptableBid;
        auctions[auctionCount].duration = duration;
    }

    /// @dev withdraw the funds from the auction
    function withDrawAuctionFunds() public {
        //require msg.sender to be auctioneer
        //require period to be elapsed
    }

    /*
     * internal functions
     */
    ///@param _id auction id
    function isTimeLeft(uint _id) private view returns (bool isTimeRemaining) {
        uint timeLeft = block.timestamp / 1 days - auctions[_id].duration;
        if (timeLeft > 1) {
            isTimeRemaining = true;
        }
        isTimeRemaining = false;
    }

    /*
     * getter functions
     */
    /// @dev get the highest bidder amount
    /// @param _id the auction id
    /// @return highestBidAmt the highest bid amount that has been placed
    function getHigestBid(uint _id) public view returns (uint highestBidAmt) {
        highestBidAmt = auctions[_id].highestBidder.amount;
    }

    ///@param _id auction id
    function getBidder(uint _id) public view returns (uint bidAmt) {
        bidAmt = auctions[_id].bids[msg.sender].amount;
    }

    /// @dev get the highest bidder
    /// @param _id the auction id
    /// @return highestBiderAddress address of the entity that has placed the bid
    function getHigestBider(
        uint _id
    ) public view returns (address highestBiderAddress) {
        highestBiderAddress = auctions[_id].highestBidder.bidder;
    }

    ///@notice number of auctions running
    function getAuctionCount() public view returns (uint count) {
        count = auctionCount;
    }
}
