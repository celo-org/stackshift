// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;
import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

contract CeloPrediction is PriceAwareOwnable {
    uint public bettingId;

    mapping(uint256 => Bettor) public bettors;

    struct Bettor {
        uint id;
        address payable signer;
        uint choice;
        bool won;
        uint amountWon;
    }

    constructor() payable {}

    function predict(uint id) external payable {
        require(msg.value == 0.2 ether, "Invalid ether amount");
        require((id == 0 || id == 1), "invalid id");
        require(
            (address(this).balance) > (msg.value * 2),
            "Not enough balance for reward"
        );
        bettingId += 1;

        Bettor memory bettor = Bettor({
            id: bettingId,
            signer: payable(msg.sender),
            choice: id,
            won: false,
            amountWon: 0
        });

        uint index = getRandomNumber() % 2;
        uint amount = msg.value * 2;

        if (id == index) {
            (bool success, ) = msg.sender.call{value: amount}("");
            require(success, "Failed to send ether.");
            bettor.won = true;
            bettor.amountWon = amount;
        }

        bettors[bettingId] = bettor;
    }

    function getRandomNumber() public view returns (uint256) {
        uint256 randomValue = getPriceFromMsg(bytes32("ENTROPY"));

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(
                    randomValue,
                    block.timestamp,
                    blockhash(block.number - 1),
                    blockhash(block.number)
                )
            )
        );

        return (randomNumber % 100) + 1;
    }

    function bettingHistory() public view returns (Bettor[] memory) {
        Bettor[] memory arr = new Bettor[](bettingId);
        for (uint i = 0; i < bettingId; i++) {
            arr[i] = bettors[i + 1];
        }
        return arr;
    }

    function getBal() public view returns (uint256) {
        return (address(this).balance);
    }
}
