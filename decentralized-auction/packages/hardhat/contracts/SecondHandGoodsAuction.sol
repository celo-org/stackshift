// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract SecondHandGoodsAuction {
    struct Auction {
        uint256 id;
        string ipfsHash;
        address payable seller;
        address payable highestBidder;
        uint256 highestBid;
        uint256 startTime;
        uint256 endTime;
        uint256 reservePrice;
        bool ended;
        bool itemReceived;
    }

    uint256 private auctionId;
    mapping(uint256 => Auction) public auctions;

    event AuctionCreated(
        uint256 indexed auctionId,
        address indexed seller,
        string ipfsHash,
        uint256 reservePrice,
        uint256 startTime,
        uint256 endTime
    );
    event NewBid(
        uint256 indexed auctionId,
        address indexed bidder,
        uint256 amount
    );
    event AuctionEnded(
        uint256 indexed auctionId,
        address indexed highestBidder,
        uint256 amount
    );
    event ItemReceived(uint256 indexed auctionId);

    function createAuction(
        string memory _ipfsHash,
        uint256 _reservePrice,
        uint256 _startTime,
        uint256 _endTime
    ) public {
        require(
            _startTime < _endTime,
            "Start time should be earlier than end time."
        );
        auctionId++;
        auctions[auctionId] = Auction(
            auctionId,
            _ipfsHash,
            payable(msg.sender),
            payable(address(0)),
            0,
            _startTime,
            _endTime,
            _reservePrice,
            false,
            false
        );
        emit AuctionCreated(
            auctionId,
            msg.sender,
            _ipfsHash,
            _reservePrice,
            _startTime,
            _endTime
        );
    }

    function placeBid(uint256 _auctionId) public payable {
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended, "Auction has ended.");
        require(
            block.timestamp >= auction.startTime &&
                block.timestamp <= auction.endTime,
            "Auction not active."
        );
        require(
            msg.value > auction.highestBid,
            "Bid amount should be higher than the current highest bid."
        );

        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid); // Refund previous highest bidder
        }

        auction.highestBidder = payable(msg.sender);
        auction.highestBid = msg.value;
        emit NewBid(_auctionId, msg.sender, msg.value);
    }

    function endAuction(uint256 _auctionId) public {
        Auction storage auction = auctions[_auctionId];
        require(!auction.ended, "Auction has ended.");
        require(block.timestamp > auction.endTime, "Auction is still active.");

        if (auction.highestBid >= auction.reservePrice) {
            auction.seller.transfer(auction.highestBid);
        } else {
            auction.highestBidder.transfer(auction.highestBid);
        }

        auction.ended = true;
        emit AuctionEnded(
            _auctionId,
            auction.highestBidder,
            auction.highestBid
        );
    }

    function confirmItemReceived(uint256 _auctionId) public {
        Auction storage auction = auctions[_auctionId];
        require(auction.ended, "Auction has not ended.");
        require(
            msg.sender == auction.highestBidder,
            "Only the highest bidder can confirm item receipt."
        );
        require(
            !auction.itemReceived,
            "Item has already been marked as received."
        );

        auction.itemReceived = true;
        emit ItemReceived(_auctionId);
    }

    function getAllAuctions() public view returns (Auction[] memory) {
        Auction[] memory allAuctions = new Auction[](auctionId);
        for (uint256 i = 0; i < auctionId; i++) {
            allAuctions[i] = auctions[i + 1];
        }
        return allAuctions;
    }

    function getAuction(
        uint256 _auctionId
    ) public view returns (Auction memory) {
        return auctions[_auctionId];
    }
}
