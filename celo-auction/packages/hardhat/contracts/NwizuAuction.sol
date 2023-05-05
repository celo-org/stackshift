// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract NwizuAuction {
    // ..........state variables.........
    uint ids;
    IERC20 public cusd;
    IERC20 public rewardToken;
    // item struct
    struct Item {
        string title;
        string rewardTitle;
        uint rewardValue;
        uint itemId;
        address seller;
        uint price;
        uint currentBid;
        uint startTime;
        uint endTime;
        address currentBidder;
        bool withdrawn;
    }

    // mapping to store auction items
    mapping(uint => Item) public auctionItems;

    // mapping to store bidders for specific items
    mapping(address => mapping(uint => uint)) public bidders;

    // events
    event itemListed(string _titleName, uint _itemId, uint _price);

    // event itemListed(string _titleName, uint _itemId, uint _price);

    // contructor
    constructor(address _token, address _rewardToken) {
        cusd = IERC20(_token);
        rewardToken = IERC20(_rewardToken);
    }

    // ............Functions..................

    // listing of item
    function listItem(
        string memory _title,
        string memory _rewardTitle,
        uint _rewardValue,
        uint _price,
        uint _starting,
        uint _ending
    ) external {
        require(msg.sender != address(0), "Not a valid address");
        require(_price > 0, "price must be greater than 0");
        require(
            _rewardValue > 0 && _rewardValue <= 300,
            "add rewards within range"
        );
        uint starting = block.timestamp + (_starting * 1 minutes);
        uint ending = starting + (_ending * 1 minutes);
        uint itemPrice = _price * (10 ** 18);
        uint prize = _rewardValue * (10 ** 18);
        require(ending > starting, "invalid start time");

        ids += 1;
        auctionItems[ids] = Item({
            title: _title,
            rewardTitle: _rewardTitle,
            rewardValue: prize,
            itemId: ids,
            seller: msg.sender,
            price: itemPrice,
            currentBid: 0,
            startTime: starting,
            endTime: ending,
            currentBidder: address(0),
            withdrawn: false
        });

        emit itemListed(_title, ids, itemPrice);
    }

    // bid to an item
    function bid(uint _id, uint _bid) external {
        Item storage item = auctionItems[_id];
        require(block.timestamp > item.startTime, "bidding is yet to start");
        require(block.timestamp <= item.endTime, "bidding closed");
        uint amount = _bid * (10 ** 18);

        require(amount > item.currentBid, "Amount must exceed current bid");
        cusd.transferFrom(msg.sender, address(this), amount);
        item.currentBid = amount;
        item.currentBidder = msg.sender;
        bidders[msg.sender][ids] += amount;
    }

    // function to withdraw bid
    function withdrawBid(uint _id) external {
        Item storage item = auctionItems[_id];
        require(block.timestamp > item.endTime, "bidding not yet closed");
        require(bidders[msg.sender][_id] > 0, "you didn't participate in bid");
        require(item.withdrawn == true, "wait for withdrawal");
        uint amountSent = bidders[msg.sender][_id];
        cusd.transfer(msg.sender, amountSent);
        bidders[msg.sender][_id] = 0;
    }

    // function withdraw auction proceed
    function withdrawAuctionProceed(uint _id) external {
        Item storage item = auctionItems[_id];
        require(msg.sender == item.seller, "not owner of auction");
        require(block.timestamp > item.endTime, "bidding not yet closed");
        uint proceed = item.currentBid;
        cusd.transfer(msg.sender, proceed);
        rewardToken.transfer(item.currentBidder, item.rewardValue);
        item.withdrawn = true;
    }

    // Function to view campaigns (this is not gas efficieent anyways)
    function seeItems() external view returns (Item[] memory) {
        Item[] memory arr = new Item[](ids);

        for (uint i = 0; i < ids; i++) {
            arr[i] = auctionItems[i + 1];
        }
        return arr;
    }

    function getBalance() external view returns (uint) {
        return cusd.balanceOf(address(this));
    }
}
