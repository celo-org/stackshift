// SPDX-License-Identifier: GPL-3.0

pragma solidity ^0.8.0;

contract BillSpliter {
    uint256 public billAmount;
    uint256 public numParticipants;

    function SetBillAmountAndParticipant(
        
        uint256 _numOfParticipants
    ) public payable {
        billAmount = msg.value;
        numParticipants = _numOfParticipants;
    }

    function splitFunds(address[] memory participants) public payable {
            for (uint256 i = 0; i < numParticipants; i++) {
                payable(participants[i]).transfer(billAmount / numParticipants);
            }
    }

    function SplitFundsByRatio(address[] memory participants, uint[] memory ratios) public payable {
            for (uint256 i = 0; i < numParticipants; i++) {
                payable(participants[i]).transfer(billAmount * ratios[i]/100);
            }
    }
}
