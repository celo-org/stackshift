//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

contract AuctionContract {
    uint256 public counter = 0;

    event auctionEvent(string name, address owner);
    event bidEvent(address owner, uint amount);

    struct Auction {
        string name;
        uint256 start_bid;
        address creator;
        address winner;
        uint start_time;
        uint end_time;
        uint reserve_price;
        string img;
        uint winningBid;
        uint256 auctionId;
        // 0 for public and 1 for private auction type
        uint auctionType;
        address[] bidders;
    }

    struct Bidders {
        uint256 bid_amount;
        address owner;
        uint256 auctionId;
        uint256 autoAmount;
        uint256 balance;
    }

    mapping(uint256 => Auction) public AuctionData;
    mapping(uint256 => mapping(address => Bidders)) public AuctionBid;
    mapping(uint256 => address[]) public automaticBidders;
    mapping(uint256 => address) public auctionToBidder;

    function createAuction(
        string calldata name,
        uint start_bid,
        uint start_time,
        uint end_time,
        uint reserve_price,
        string calldata img,
        uint auctionType
    ) external {
        require(start_bid > 0, "Start Bid must be greater than zero");
        require(reserve_price > 0, "Reserve price must be greater than zero");

        address[] memory bidders;

        AuctionData[counter] = Auction(
            name,
            start_bid,
            msg.sender,
            address(0),
            start_time,
            end_time,
            reserve_price,
            img,
            0,
            counter,
            auctionType,
            bidders
        );

        counter++;
        emit auctionEvent(name, msg.sender);
    }

    function bid(uint auctionId) public payable {
        require(
            block.timestamp >= AuctionData[auctionId].start_time,
            "Auction has not started"
        );

        require(
            block.timestamp <= AuctionData[auctionId].end_time,
            "Auction has ended"
        );
        require(msg.value > 0, "Bid must be greater than zero");
        uint tbid = msg.value + AuctionBid[auctionId][msg.sender].bid_amount;
        require(
            tbid > AuctionData[auctionId].winningBid,
            "Bid must be greate then winning Bid"
        );

        if (auctionToBidder[auctionId] != msg.sender) {
            auctionToBidder[auctionId] = msg.sender;
            AuctionData[auctionId].bidders.push(msg.sender);
        }

        AuctionData[auctionId].winner = msg.sender;
        AuctionData[auctionId].winningBid = tbid;

        AuctionBid[auctionId][msg.sender].bid_amount = tbid;
        AuctionBid[auctionId][msg.sender].auctionId = auctionId;
        AuctionBid[auctionId][msg.sender].owner = msg.sender;

        (bool success, ) = (address(this)).call{value: msg.value}("");
        require(success, "Failed to send Ether");

        emit bidEvent(msg.sender, msg.value);

        for (uint256 i = 0; i < automaticBidders[auctionId].length; i++) {
            if (
                AuctionData[auctionId].winningBid >
                AuctionBid[auctionId][automaticBidders[auctionId][i]]
                    .bid_amount &&
                AuctionBid[auctionId][automaticBidders[auctionId][i]]
                    .bid_amount +
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .autoAmount >
                AuctionData[auctionId].winningBid &&
                AuctionBid[auctionId][automaticBidders[auctionId][i]].balance >
                AuctionBid[auctionId][automaticBidders[auctionId][i]].autoAmount
            ) {
                AuctionData[auctionId].winningBid =
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .autoAmount +
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .bid_amount;

                AuctionData[auctionId].winner = automaticBidders[auctionId][i];

                AuctionBid[auctionId][automaticBidders[auctionId][i]]
                    .bid_amount =
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .autoAmount +
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .bid_amount;

                uint blc = AuctionBid[auctionId][automaticBidders[auctionId][i]]
                    .balance -
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .autoAmount;

                AuctionBid[auctionId][automaticBidders[auctionId][i]]
                    .balance = blc;

                emit bidEvent(
                    automaticBidders[auctionId][i],
                    AuctionBid[auctionId][automaticBidders[auctionId][i]]
                        .autoAmount +
                        AuctionBid[auctionId][automaticBidders[auctionId][i]]
                            .bid_amount
                );
            }
        }
    }

    function automaticBid(
        uint auctionId,
        uint initialBid,
        uint amountTobeAddedEveryRebid
    ) public payable {
        require(
            block.timestamp >= AuctionData[auctionId].start_time,
            "Auction has not started"
        );
        require(
            block.timestamp <= AuctionData[auctionId].end_time,
            "Auction has ended"
        );
        require(msg.value > 0, "Bid must be greater than zero");
        uint tbid = msg.value + AuctionBid[auctionId][msg.sender].bid_amount;
        require(
            tbid > AuctionData[auctionId].winningBid,
            "Bid must be greate then winning Bid"
        );

        if (auctionToBidder[auctionId] != msg.sender) {
            auctionToBidder[auctionId] = msg.sender;
            AuctionData[auctionId].bidders.push(msg.sender);
        }
        automaticBidders[auctionId].push(msg.sender);

        AuctionData[auctionId].winner = msg.sender;
        AuctionData[auctionId].winningBid = initialBid;

        AuctionBid[auctionId][msg.sender].bid_amount = initialBid;
        AuctionBid[auctionId][msg.sender].auctionId = auctionId;
        AuctionBid[auctionId][msg.sender].owner = msg.sender;
        AuctionBid[auctionId][msg.sender]
            .autoAmount = amountTobeAddedEveryRebid;
        uint blc = msg.value - initialBid;
        AuctionBid[auctionId][msg.sender].balance = blc;

        (bool success, ) = address(this).call{value: initialBid}("");
        require(success, "Failed to send Ether");
    }

    function bidWithdraw(uint auctionId) public {
        AuctionBid[auctionId][msg.sender].balance = AuctionBid[auctionId][
            msg.sender
        ].bid_amount;

        AuctionBid[auctionId][msg.sender].bid_amount = 0;
        AuctionBid[auctionId][msg.sender].auctionId = auctionId;

        address winner;
        uint bid_amount;
        for (uint256 i = 0; i < AuctionData[auctionId].bidders.length; i++) {
            if (
                AuctionBid[auctionId][AuctionData[auctionId].bidders[i]]
                    .bid_amount > bid_amount
            ) {
                winner = AuctionData[auctionId].bidders[i];
                bid_amount = AuctionBid[auctionId][
                    AuctionData[auctionId].bidders[i]
                ].bid_amount;
            }
        }

        AuctionData[auctionId].winner = winner;
        AuctionData[auctionId].winningBid = bid_amount;
    }

    function bidRefund(uint auctionId) public {
        uint balance = AuctionBid[auctionId][msg.sender].balance;
        (bool success, ) = payable(msg.sender).call{value: balance}("");
        require(success, "Failed to send Ether");
    }

    function getWinner(uint auctionId) public view returns (Auction memory) {
        return AuctionData[auctionId];
    }

    function fetchAuctions() public view returns (Auction[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionData[i].auctionType == 0) {
                itemCount += 1;
            }
        }

        Auction[] memory items = new Auction[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionData[i].auctionType == 0) {
                uint256 currentId = i;

                Auction storage currentItem = AuctionData[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyAuctions() public view returns (Auction[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionData[i].creator == msg.sender) {
                itemCount += 1;
            }
        }

        Auction[] memory items = new Auction[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionData[i].creator == msg.sender) {
                uint256 currentId = i;

                Auction storage currentItem = AuctionData[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchMyBids() public view returns (Bidders[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionBid[i][msg.sender].owner == msg.sender) {
                itemCount += 1;
            }
        }

        Bidders[] memory items = new Bidders[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (AuctionBid[i][msg.sender].owner == msg.sender) {
                uint256 currentId = i;

                Bidders storage currentItem = AuctionBid[currentId][msg.sender];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
