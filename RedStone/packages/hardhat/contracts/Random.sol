//SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

contract Random is PriceAwareOwnable {
    uint256 public counter;
    uint256 public lastValue = 0;

    struct Bet {
        uint256 id;
        address player;
        uint256 bet_amount;
        bool status;
    }

    mapping(uint256 => Bet) public BetData;
    mapping(address => uint256) public winnings;

    constructor() payable {}

    function random() private view returns (uint256) {
        uint256 randomValue = getPriceFromMsg(bytes32("ENTROPY"));

        uint256 randomNumber = uint256(
            keccak256(
                abi.encodePacked(randomValue, block.timestamp, blockhash(block.number - 1), blockhash(block.number))
            )
        );

        return (randomNumber % 3) + 1;
    }

    function guess(uint256 guessNum) public payable {
        uint256 answer = random();
        lastValue = answer;
        if (guessNum == answer) {
            BetData[counter] = Bet(counter, msg.sender, msg.value, true);
            winnings[msg.sender] = winnings[msg.sender] + msg.value + msg.value;
        } else {
            BetData[counter] = Bet(counter, msg.sender, msg.value, false);
        }
        counter++;
    }

    function getUserHistory() public view returns (Bet[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (BetData[i].player == msg.sender) {
                itemCount += 1;
            }
        }

        Bet[] memory items = new Bet[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (BetData[i].player == msg.sender) {
                uint256 currentId = i;

                Bet storage currentItem = BetData[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function getuserLastGame() public view returns (Bet memory) {
        Bet[] memory history = getUserHistory();
        Bet memory Last = history[0];
        return Last;
    }

    function getAllHistory() public view returns (Bet[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            itemCount += 1;
        }

        Bet[] memory items = new Bet[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            uint256 currentId = i;

            Bet storage currentItem = BetData[currentId];
            items[currentIndex] = currentItem;

            currentIndex += 1;
        }
        return items;
    }

    function withdraw(uint256 amount) public {
        require(winnings[msg.sender] > amount, "Insufficient balance");

        (bool success,) = payable(msg.sender).call{value: amount}("");
        require(success, "Failed to send Celo");
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
