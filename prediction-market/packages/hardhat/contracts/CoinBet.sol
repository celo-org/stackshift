// SPDX-License-Identifier: MIT

pragma solidity ^0.8.4;
import "redstone-evm-connector/lib/contracts/message-based/PriceAwareOwnable.sol";

contract CoinBet is PriceAwareOwnable {
    uint256 public lastGeneratedRandomNumber;

    struct Bet {
        address user;
        uint256 wager;
        uint256 choice;
        uint256 payout;
        bool status;
    }

    mapping(address => Bet[]) public bets;

    event BetPlaced(
        address indexed user,
        uint256 wager,
        uint256 choice,
        uint256 timestamp
    );
    event BetResult(
        address indexed user,
        bool win,
        uint256 wager,
        uint256 payout,
        uint256 timestamp
    );

    constructor() payable {}

    function placeBet(uint256 choice) external payable {
        require(
            choice == 0 || choice == 1,
            "Invalid choice, 0 for Head and 1 for Tail"
        );
        require(msg.value > 0, "Wager must be greater than 0");
        require(
            address(this).balance >= msg.value * 2,
            "Contract has insufficient funds to cover potential payout"
        );

        Bet memory bet = Bet({
            user: msg.sender,
            wager: msg.value,
            payout: 0,
            choice: choice,
            status: false
        });

        emit BetPlaced(msg.sender, msg.value, choice, block.timestamp);

        // Simulate coin toss
        lastGeneratedRandomNumber = random();
        uint256 tossResult = lastGeneratedRandomNumber % 2;
        if (tossResult == choice) {
            uint256 winAmount = bet.wager * 2;
            bet.payout = winAmount;
            bet.status = true;

            (bool success, ) = msg.sender.call{value: winAmount}("");
            require(success, "Transfer failed.");
        }
        bets[msg.sender].push(bet);

        emit BetResult(
            msg.sender,
            bet.status,
            msg.value,
            bet.payout,
            block.timestamp
        );
    }

    function random() private view returns (uint256) {
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
}
