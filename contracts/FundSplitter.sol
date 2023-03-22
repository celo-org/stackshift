//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

contract FundSplitter {

    address payable[] public participants;
    address public owner;
    bool private locked;

    modifier noReentrancy() {
        require(!locked, "Reentrant call");
        locked = true;
        _;
        locked = false;
    }

    function addParticipant(address _participant) public {
        participants.push(payable(_participant));
    }
    

    function splitBill() public payable noReentrancy {
        require(address(this).balance > 0, "Invalid amount Entered");
        require(participants.length > 0, "No participants added");

        uint256 amountPerParticipant = address(this).balance / participants.length;

        for (uint256 i = 0; i < participants.length; i++) {
            (bool sent,) = participants[i].call{value: amountPerParticipant}("");
            require(sent, "Failed to send Ether");
        }
    }

    function getParticipants() public view returns (address payable[] memory) {
        return participants;
    }

    function resetParticipants() public {
        delete participants;
    }

    function getContractBalance() public view returns(uint256) {
        return address(this).balance;
    }

}
