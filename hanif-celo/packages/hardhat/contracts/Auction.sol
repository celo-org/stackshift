//SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;

contract Auction {
  struct Item {
    string name;
    string image;
    uint256 startingPrice;
    uint256 biddingPeriod;
    uint256 reservePrice;
    uint256 highestBid;
    address highestBidder;
  }

  Item[] public items;

  event NewBid(uint256 itemId, address bidder, uint256 amount);

  function addItem(
    string memory _name,
    string memory _image,
    uint256 _startingPrice,
    uint256 _biddingPeriod,
    uint256 _reservePrice
  ) public {
    Item memory newItem = Item({
      name: _name,
      image: _image,
      startingPrice: _startingPrice,
      biddingPeriod: _biddingPeriod,
      reservePrice: _reservePrice,
      highestBid: _startingPrice,
      highestBidder: msg.sender
    });

    items.push(newItem);
  }

  function getItemsCount() public view returns (uint256) {
    return items.length;
  }

  function getHighestBid(uint256 itemId) public view returns (uint256) {
    return items[itemId].highestBid;
  }

  function getBiddingPeriod(uint256 itemId) public view returns (uint256) {
    return items[itemId].biddingPeriod;
  }

  function getReservePrice(uint256 itemId) public view returns (uint256) {
    return items[itemId].reservePrice;
  }

  function bid(uint256 itemId) public payable {
    require(msg.value > items[itemId].highestBid, "Bid too low");
    require(block.timestamp < items[itemId].biddingPeriod, "Bidding period has ended");

  if (items[itemId].highestBidder != address(0)) {
  address payable highestBidderPayable = payable(items[itemId].highestBidder);
  highestBidderPayable.transfer(items[itemId].highestBid);
}

    items[itemId].highestBid = msg.value;
    items[itemId].highestBidder = msg.sender;

    emit NewBid(itemId, msg.sender, msg.value);
  }

  function withdrawBid(uint256 itemId) public {
    require(msg.sender == items[itemId].highestBidder, "Only highest bidder can withdraw bid");
    require(block.timestamp >= items[itemId].biddingPeriod, "Bidding period has not ended yet");

    uint256 amount = items[itemId].highestBid;
    items[itemId].highestBid = items[itemId].startingPrice;
    items[itemId].highestBidder = address(0);

   address payable recipient = payable(msg.sender);
recipient.transfer(amount);
  }
}