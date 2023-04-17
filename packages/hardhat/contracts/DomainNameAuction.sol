// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract DomainNameAuction {

    uint256 domainCount;

    struct Domain {
        address payable owner;
        string domainName;
        uint256 reservePrice;
        uint256 highestBid;
        address payable highestBidder;
        uint256 endTime;
        bool ended;
    }

    event DomainCreated(address indexed owner, string domainName, uint256 endTime);
    event AuctionEnded(address indexed winner, uint256 highestBid);

    mapping(uint256 => Domain) public domainNames;
    mapping(string => bool) public domainNameExists;


    // Creating domain automatically starts the auction.
    function createAuction(string calldata _domainName, uint256 _reservePrice, uint256 _endTime) public {
        require(domainNameExists[_domainName] == false, "Domain name already exists.");
        require(_endTime > 0, "Bidding time must be greater than zero.");

        uint256 _highestBid = 0;

        domainNames[domainCount] = Domain(
            payable(msg.sender),
            _domainName,
            _reservePrice,
            _highestBid,
            payable(address(0)),
            _endTime,
            false
        );

        domainNameExists[_domainName] = true;
        domainCount++;
        emit DomainCreated(msg.sender, _domainName, _endTime);
    }

    function bid(uint256 _index) public payable {
        Domain storage auction = domainNames[_index];

        require(!auction.ended, "Auction has ended.");
        require(msg.sender != auction.owner, "Owner cannot bid on their own auction.");
        require(msg.value > auction.reservePrice, "Bid amount must be greater than current highest bid.");
        require(msg.value > auction.highestBid, "Bid amount must be greater than current highest bid.");

        if (auction.highestBidder != address(0)) {
            auction.highestBidder.transfer(auction.highestBid);
        }

        auction.highestBid = msg.value;
        auction.highestBidder = payable(msg.sender);
    }

    function endAuction(uint256 _index) public {
        Domain storage auction = domainNames[_index];
        require(auction.ended == false, "Auction already ended.");
        //require(block.timestamp >= auction.endTime, "Auction has not ended yet.");

        auction.owner.transfer(auction.highestBid);

        // Reset auction for this domain.
        if (auction.highestBidder != address(0)) {
            auction.owner = auction.highestBidder;
        }

        auction.reservePrice = auction.highestBid;
        auction.highestBidder = payable(address(0));
        auction.endTime = 0;
        auction.ended = true;

        emit AuctionEnded(auction.highestBidder, auction.highestBid);
    }

    function startAuction(uint256 _index, uint256 _endTime) public {
        Domain storage auction = domainNames[_index];

        require(auction.ended, "Auction already started.");
        require(msg.sender == auction.owner, "Only the owner can start auction.");

        auction.endTime = _endTime;
        auction.ended = false;
    }


    function getAuction(uint _index) public view returns (
        address payable _owner,
        string memory _name,
        uint256 _reservePrice,
        uint256 _highestBid,
        address payable highestBidder,
        uint256 _endTime,
        bool _ended
    ) {
        Domain storage domain = domainNames[_index];
        return (
            domain.owner,
            domain.domainName,
            domain.reservePrice,
            domain.highestBid,
            domain.highestBidder,
            domain.endTime,
            domain.ended
        );
    }

    function getDomainCount() public view returns (uint256) {
        return domainCount;
    }
}
