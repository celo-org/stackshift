    // SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "./IERC20.sol";

contract DoAuctions {
    
    event Start(
        uint256 id,
        address seller,
        uint256 startingPrice,
        uint256 reservePrice,
        uint256 beginning,
        uint256 ending
    );
 
    event Bid(uint256 id, address bidder, uint256 amount);
    event Refund(uint256 id, address bidder, uint256 amount);
    event Withdrawal(uint256 id);

    // struct to pack the variables of the campaign


    struct Auction {
        
           address payable seller;
           uint reservePrice;
           uint currentPrice;
           address winningBid;
           uint beginning;
           uint ending;
           bool withdrawn;
           Bidder[] biddersInfo;
    }

    struct Bidder {
           address bidder;
           uint amount;
    }

    IERC20 public immutable token;


    mapping(uint256 => Auction) public auctions;

    // this mapping will be useful for ERC-20 transferFrom
    mapping(uint256 => mapping(address => uint256)) public bids;

    uint256 public auctionCount;

    constructor(address _token) {
        if (_token == address(0)) revert();
        token = IERC20(_token);
    }

     function getEndDate(uint8 _days) private pure returns (uint256) {
       if (_days < 0) revert();
       return uint256(_days * 86400);
     }



    function kickOff(
      address _seller,
      uint256 _reservePrice,
      uint8 _startingPrice,
      uint8 _endingDays
    ) external returns (uint256) {
      // do this for auto-incrementation
        auctionCount++;
        auctions[auctionCount].seller = payable(_seller);
        auctions[auctionCount].currentPrice = _startingPrice;
        auctions[auctionCount].reservePrice = _reservePrice;
        auctions[auctionCount].beginning = block.timestamp;
        auctions[auctionCount].ending =
          auctions[auctionCount].beginning +
          getEndDate(_endingDays);
      uint256 endDate = auctions[auctionCount].ending;
      auctions[auctionCount].withdrawn = false; // because the default of bool is false

      require(
          endDate < block.timestamp + 30 days,
          "Auction must end in 30 days"
      );

      emit Start(
          auctionCount,
          _seller,
          _startingPrice,
          _reservePrice,
          block.timestamp,
          endDate
      );
      return auctionCount;
    }

    function bid (uint256 _sellersId, uint _amount) external {
        require(
            block.timestamp <= auctions[_sellersId].ending,
            "Cannot bid, auction has ended."
        );
        require(
            _amount > auctions[_sellersId].currentPrice,
            "Bid is lower than the current bid price."
        );
        token.transferFrom(msg.sender, address(this), _amount);
        auctions[_sellersId].currentPrice = _amount;
        auctions[_sellersId].winningBid = msg.sender;
        bids[_sellersId][msg.sender] += _amount;
        Auction storage auction = auctions[_sellersId];
        auction.biddersInfo.push(Bidder(msg.sender, _amount));
        emit Bid(_sellersId, msg.sender, _amount);
    }


   function refundFailedBid(uint256 _sellersId) external {
        require(
            msg.sender != auctions[_sellersId].winningBid,
            "You are currently the winning bid, you cannot withdraw."
        );
        require(
            bids[_sellersId][msg.sender] > 0,
            "You have not bid or already withdrawn."
        );


        bids[_sellersId][msg.sender] = 0;
        token.transfer(msg.sender, bids[_sellersId][msg.sender]);

        emit Refund(_sellersId, msg.sender, bids[_sellersId][msg.sender]);
   }

    function withdraw(uint256 _sellersId) external {
        require(
            auctions[_sellersId].seller == msg.sender,
            "Error, only the seller can withdraw"
        );
        require(
            block.timestamp > auctions[_sellersId].ending,
            "Cannot withdraw until auction end date has passed."
        );
        require( 
            auctions[_sellersId].withdrawn == false,
            "Already withdrawn."
        );

        auctions[_sellersId].withdrawn = true;
        token.transfer(auctions[_sellersId].seller, auctions[_sellersId].currentPrice);

        emit Withdrawal(_sellersId);

   }

    

}