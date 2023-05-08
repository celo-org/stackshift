// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC721/utils/ERC721Holder.sol";

contract Auction is ERC721Holder {
    uint public startingPrice;
    uint public highestBid;
    address public seller;
    address public highestBidder;
    IERC721 public nft;
    uint public nftId;
    uint public auctionEndTime;

    struct Bidder {
        bool bidded;
        uint amount;
    }

    mapping(address => Bidder) public returnOutBids;

    event AuctionStarted();
    event BidPlaced(address bidder, uint amount);
    event AuctionEnded(address winner, uint amount);

    constructor(address _nft, uint _nftId, uint _startingPrice, uint _biddingTime, address _seller) {
        nft = IERC721(_nft);
        nftId = _nftId;
        seller = _seller;
        startingPrice = _startingPrice;
        auctionEndTime = block.timestamp + _biddingTime;
    }

    modifier checkAuctionTime() {
        require(block.timestamp < auctionEndTime, "Auction has ended");
        _;
    }

    modifier checkAuctionStatus() {
        require(auctionEndTime > 0, "Auction not started");
        _;
    }

    modifier checkBidderStatus() {
        require(msg.sender != seller, "You can't participate in this auction");
        _;
    }

    modifier checkHighestBidder() {
        require(msg.value > 0, "You need money to bid");
        require(msg.value >= startingPrice, "You need to bid at least the starting price");

        if (msg.value > highestBid) {
            if (highestBidder != address(0)) {
                returnOutBids[highestBidder].amount = highestBid;
            }
            highestBid = msg.value;
            highestBidder = msg.sender;
        } else {
            returnOutBids[msg.sender].amount = msg.value;
        }

        startingPrice = highestBid;

        _;
    }

    modifier endAuctionCheck() {
        require(auctionEndTime > 0 && block.timestamp >= auctionEndTime, "Auction is still ongoing");
        _;
    }

    function startAuction() public {
        require(auctionEndTime == 0, "Auction already started");
        require(nft.ownerOf(nftId) == address(this), "Contract does not own the NFT");

        auctionEndTime = block.timestamp + (3 * 24 * 60 * 60); // Auction duration of 3 days

        emit AuctionStarted();
    }

    function bid() public payable checkAuctionTime checkAuctionStatus checkBidderStatus checkHighestBidder {
        Bidder storage checkBidder = returnOutBids[msg.sender];
        require(!checkBidder.bidded, "You have already bidded, wait for the result!");

        checkBidder.bidded = true;

        emit BidPlaced(msg.sender, msg.value);
    }

    function endAuction() public endAuctionCheck {
        require(highestBidder != address(0), "No bids placed");

        uint amount = highestBid;
        address winner = highestBidder;

        highestBid = 0;
        highestBidder = address(0);
        auctionEndTime = 0;

        nft.safeTransferFrom(address(this), winner, nftId);
        payable(seller).transfer(amount);

        emit AuctionEnded(winner, amount);
    }

    function withdrawOutBids() public endAuctionCheck {
        uint amount = returnOutBids[msg.sender].amount;

        require(amount > 0, "You don't have any funds to withdraw");

        returnOutBids[msg.sender].amount = 0;

        payable(msg.sender).transfer(amount);
    }

    function updateStartingPrice(uint _startingPrice) public endAuctionCheck {
        require(_startingPrice > 0, "Starting price must be greater than zero");

        startingPrice = _startingPrice;
    }

    function updateAuctionEndTime(uint _biddingTime) public endAuctionCheck {
        require(_biddingTime > 0, "Bidding time must be greater than zero");

        auctionEndTime = block.timestamp + _biddingTime;
    }
}

