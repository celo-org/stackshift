// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

// Uncomment this line to use console.log
import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/math/SafeMath.sol";

contract Split {
    using Counters for Counters.Counter;
    using SafeMath for uint256;

    ///@notice only folks who know each other will be allowed to use this
    mapping(address => uint) public balances;

    uint256 totalCash = 0;

    Counters.Counter private noOfFriends;
    
    function removeFriend(address friend) public {
        noOfFriends.decrement();

        //send balance to friend
        (bool sent, ) = friend.call{value: balances[friend]}("");
        require(sent, "Couldn't send funds securely");

        //check if his balance is zero
        require(balances[friend] == 0, "cannot remove if balance isn't zero");
        delete balances[friend];
    }

    //@notice map each user's funds appropriately
    function becomeAFriend() public payable {
        require(msg.value > 0, "not enough funds to become a friend");

        noOfFriends.increment();

        balances[msg.sender] += msg.value;
    }

    //update user's balance subtract // ! REMOVE LATER
    //bill will be split equally
    function payBill(
        uint256 billAmt,
        address receiver,
        address[] memory _billTo
    ) public {
        uint256 shareToPay = (billAmt / noOfFriends.current());
    
        //balances validation
        for (uint index = 0; index < _billTo.length; index++) {
            // check friends balance
            require(
                balances[_billTo[index]] > shareToPay,
                "reverting. Not enough funds to pay for bill"
            );

            //update friends balance
            balances[_billTo[index]] -= shareToPay;
        }

        //pay the bill
        (bool sent, ) = receiver.call{value: billAmt}("");
        require(sent, "failed to send the funds for address");
    }

    function checkFriendsBalance(
        address addressToCheck
    ) public view returns (uint256 balance) {
        return balances[addressToCheck];
    }
}
