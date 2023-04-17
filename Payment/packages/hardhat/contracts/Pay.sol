//SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

// remember to remove unnecessary imports and its use when deploying your smart contract
import "hardhat/console.sol";

contract Pay {
    uint256 public counter = 0;
    uint256 public groupCounter = 0;

    event splitEvent(string name, address sender);

    enum PaymentStatus {
        pending,
        accepted,
        rejected,
        paid
    }

    PaymentStatus public status;

    struct Split {
        string name;
        uint256 amount;
        uint256 amountReceivedByRecipient;
        address creator;
        address[] friends;
        string status;
        address recipient;
        uint256 splitId;
    }

    struct SplitStat {
        uint256 amount;
        address creator;
        address owner;
        string status;
        PaymentStatus request;
        uint256 splitId;
    }

    struct GroupStruct {
        string name;
        address owner;
    }

    mapping(uint256 => Split) public SplitData;
    mapping(uint256 => mapping(address => SplitStat)) public SplitStats;
    mapping(string => address) Usernames;
    mapping(address => string) AddrToUser;
    mapping(string => address[]) public SplitGroup;
    mapping(uint256 => mapping(address => GroupStruct)) public SplitGroup2;

    constructor() {}

    /**
     * @dev Creates a Split Payment between friends in the array and stores the data
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the `amount` must be greater than zero.
     *
     *
     *
     * Emits a {Transfer} event.
     */

    function createSplit(
        uint amount,
        string calldata name,
        address[] calldata friendsAddress,
        uint[] calldata friendsAmount,
        address recipient
    ) external {
        require(recipient != address(0), "Recipient cannot be zero address");
        require(
            friendsAddress.length >= 2,
            "Split Friends must be at least two"
        );
        require(
            friendsAmount.length >= 2,
            "Split Friends must be at least two"
        );

        uint generalAmount;

        for (uint256 i = 0; i < friendsAmount.length; i++) {
            generalAmount = generalAmount + friendsAmount[i];
        }
        require(amount == generalAmount, "Shared Total is not equal to amount");

        SplitData[counter] = Split(
            name,
            amount,
            0,
            msg.sender,
            friendsAddress,
            "pending",
            recipient,
            counter
        );

        for (uint256 i = 0; i < friendsAddress.length; i++) {
            console.log("c", friendsAddress[i]);
            SplitStats[counter][friendsAddress[i]] = SplitStat(
                friendsAmount[i],
                msg.sender,
                friendsAddress[i],
                "pending",
                status,
                counter
            );
        }

        counter++;
        emit splitEvent(name, msg.sender);
    }

    function acceptOrRejectSplit(
        bool currentStatus,
        uint splitId
    ) external payable {
        if (currentStatus == true) {
            uint _amount = SplitStats[splitId][msg.sender].amount;
            require(_amount >= msg.value, "Split Friends must be at least two");
            SplitStats[splitId][msg.sender].request = PaymentStatus.accepted;
            SplitStats[splitId][msg.sender].status = "paid";

            address _to = SplitData[splitId].recipient;
            SplitData[splitId].amountReceivedByRecipient =
                SplitData[splitId].amountReceivedByRecipient +
                _amount;

            if (
                SplitData[splitId].amountReceivedByRecipient ==
                SplitData[splitId].amount
            ) {
                SplitData[splitId].status = "completed";
            }

            (bool success, ) = _to.call{value: msg.value}("");
            require(success, "Failed to send Ether");
        } else if (currentStatus == false) {
            SplitStats[splitId][msg.sender].request = PaymentStatus.rejected;
        }
    }

    function fetchMySplits() public view returns (Split[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (SplitData[i].creator == msg.sender) {
                itemCount += 1;
            }
        }

        Split[] memory items = new Split[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (SplitData[i].creator == msg.sender) {
                uint256 currentId = i;

                Split storage currentItem = SplitData[currentId];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function getRequests(
        address addr
    ) public view returns (SplitStat[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < counter; i++) {
            if (
                SplitStats[i][addr].owner == addr &&
                SplitStats[i][addr].request == PaymentStatus.pending
            ) {
                itemCount += 1;
            }
        }

        SplitStat[] memory items = new SplitStat[](itemCount);

        for (uint256 i = 0; i < counter; i++) {
            if (
                SplitStats[i][addr].owner == addr &&
                SplitStats[i][addr].request == PaymentStatus.pending
            ) {
                uint256 currentId = i;

                SplitStat storage currentItem = SplitStats[currentId][addr];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function setUsername(string calldata username) external {
        string memory user = _toLower(username);
        if (getAddress(username) == msg.sender) {
            delete Usernames[user];
            delete AddrToUser[msg.sender];
        }
        require(getAddress(username) == address(0), "Username has been taken");

        Usernames[user] = msg.sender;
        AddrToUser[msg.sender] = user;
    }

    function createGroup(
        address[] calldata group,
        string calldata name
    ) external {
        string memory gname = _toLower(name);
        require(SplitGroup[gname].length == 0, "Group name has been taken");
        SplitGroup[name] = group;
        SplitGroup2[groupCounter][msg.sender] = GroupStruct(name, msg.sender);
        groupCounter++;
    }

    function _toLower(string memory str) internal pure returns (string memory) {
        bytes memory bStr = bytes(str);
        bytes memory bLower = new bytes(bStr.length);
        for (uint i = 0; i < bStr.length; i++) {
            // Uppercase character...
            if ((uint8(bStr[i]) >= 65) && (uint8(bStr[i]) <= 90)) {
                // So we add 32 to make it lowercase
                bLower[i] = bytes1(uint8(bStr[i]) + 32);
            } else {
                bLower[i] = bStr[i];
            }
        }
        return string(bLower);
    }

    function getAddress(string memory username) public view returns (address) {
        username = _toLower(username);
        return Usernames[username];
    }

    function getUsername(address addr) public view returns (string memory) {
        return AddrToUser[addr];
    }

    function fetchMyGroup() public view returns (GroupStruct[] memory) {
        uint256 currentIndex = 0;
        uint256 itemCount = 0;

        for (uint256 i = 0; i < groupCounter; i++) {
            if (SplitGroup2[i][msg.sender].owner == msg.sender) {
                itemCount += 1;
            }
        }

        GroupStruct[] memory items = new GroupStruct[](itemCount);

        for (uint256 i = 0; i < groupCounter; i++) {
            if (SplitGroup2[i][msg.sender].owner == msg.sender) {
                uint256 currentId = i;

                GroupStruct storage currentItem = SplitGroup2[currentId][
                    msg.sender
                ];
                items[currentIndex] = currentItem;

                currentIndex += 1;
            }
        }
        return items;
    }

    function fetchNameGroup(
        string memory name
    ) public view returns (address[] memory) {
        return SplitGroup[name];
    }

    function getSplitData(uint num) public view returns (Split memory) {
        return SplitData[num];
    }
}
