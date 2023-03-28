
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Splitter {
 address payable public friend1;
    address payable public friend2;

    constructor(address payable _friend1, address payable _friend2) {
        friend1 = _friend1;
        friend2 = _friend2;
    }

    function splitBill(uint256 billAmount) public payable {
        require(msg.value == billAmount * 2, "Please send the correct amount.");
        friend1.transfer(billAmount);
        friend2.transfer(billAmount);
    }
}

