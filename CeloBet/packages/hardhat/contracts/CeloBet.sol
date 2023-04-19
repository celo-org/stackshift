// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@redstone-finance/evm-connector/contracts/data-services/CustomUrlsConsumerBase.sol";

// Simpple usecase of custom url

// Contract that allow users to place a bet. 
// To decide whether or not the price of celo will increase after a certain block period.
// Users can only bet once. After the block period is reached the money is transfereed to
// the winners in addition to the money from the losers

contract CeloBet is CustomUrlsConsumerBase{
    
    struct User {
        address payable userAddress;
        uint256 bet; // 1 for increase, 0 for decrease
        uint256 betAmount;
    }

    event AmountReceived(uint256 amount);

    User[] public userList;
    mapping(address => bool) public exist;
    mapping(address => bool) public hasBet;
    address payable public owner;
    uint256 public blockNumber;
    bool public betClosed;
    uint256 public totalBetAmount;
    uint256 public yesCount;
    uint256 public noCount;
    uint256 public totalYesAmount;
    uint256 public totalNoAmount;

    // To be deleted use the price from redstone instead;
    // uint256 public price = 1;

    constructor(uint256 _blockNumber) {
        owner = payable(msg.sender);
        blockNumber = _blockNumber;
        betClosed = false;
        totalBetAmount = 0;
        yesCount = 0;
        noCount = 0;
    }

    modifier onlyOwner {
        require(msg.sender == owner, "You are not the owner");
        _;
    }

    modifier betOpen {
        require(!betClosed, "Betting is closed");
        _;
    }

    modifier betClosedModifier {
        require(betClosed, "Betting is not closed yet");
        _;
    }

    function registerUser() public {
        require(!exist[msg.sender], "Already registered");

        userList.push(User(payable(msg.sender), 2, 0));
        exist[msg.sender] = true;
    }

    function getUsers() public view returns (User[] memory) {
        return userList;
    }


    function placeBet(uint256 _bet) public payable betOpen {
        require(exist[msg.sender], "You have not registered");
        require(!hasBet[msg.sender], "You have already placed a bet");
        require(_bet == 0 || _bet == 1, "Invalid bet value"); // 0 for decrease, 1 for increase
        require(msg.value > 0, "bet amount must be more than 0");

        hasBet[msg.sender] = true;
        totalBetAmount += msg.value;

        if (_bet == 1) {
            yesCount += 1;
            totalYesAmount += msg.value;
        } else {
            noCount += 1;
            totalNoAmount += msg.value;
        }

        userList.push(User(payable(msg.sender), _bet, msg.value));
    }

       //This function could be called using openzeplin defender relay automation
    function getCeloPrice() public view onlyOwner returns(uint256) {
        return getOracleNumericValueFromTxMsg(bytes32("0xc0ede6807bd5d9da"));
    }


 function closeBet() public payable onlyOwner betOpen {
    require(block.number >= blockNumber, "Block period not yet reached");

    betClosed = true;

    uint256 price = getOracleNumericValueFromTxMsg(bytes32("0xc0ede6807bd5d9da"));

    uint256 yesBal = totalYesAmount/ noCount;
    uint256 noBal = totalNoAmount / yesCount;

    for (uint256 i = 0; i < userList.length; i++) {
        uint256 receipientAmount = 0;

        if (price >= 1 && userList[i].bet == 1) {   
            receipientAmount = userList[i].betAmount + noBal;
            if (receipientAmount > 0) {
                require(address(this).balance >= receipientAmount, "Insufficient contract balance");
                userList[i].userAddress.transfer(receipientAmount);
            }
            
        }else if (price < 1 && userList[i].bet == 0) {
            receipientAmount = userList[i].betAmount + yesBal;
                if (receipientAmount > 0) {
                    require(address(this).balance >= receipientAmount, "Insufficient contract balance");
                    userList[i].userAddress.transfer(receipientAmount);
                }
        }
    }

    // Transfer remaining balance back to the owner
    owner.transfer(address(this).balance);
}

    function getContractBalance() public view returns (uint256) {
        return address(this).balance;
    }

    function withdraw() public {
           // get the amount of Ether stored in this contract
        uint amount = address(this).balance;

        // send all Ether to owner
        // Owner can receive Ether since the address of owner is payable
        (bool success, ) = owner.call{value: amount}("");
        require(success, "Failed to send Ether");
    }

}