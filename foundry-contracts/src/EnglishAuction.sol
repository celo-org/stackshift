// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/console.sol"; //! remove later

import "openzeppelin-contracts/contracts/utils/math/SafeMath.sol";

contract EnglishAuction {
    using SafeMath for uint256;

    struct Auction {
        string name; //name of the auction
        address payable auctioneer; //who is conducting it
        uint leastAcceptableBid;
        Bidder highestBidder;
        uint duration; //period for which the acution will run
        Bidder[] bidders;
    }

    struct Bidder {
        address bidder;
        uint amount;
    }

    struct MetaData {
        string itemImage;
        string itemUri;
    }

    //using ids for keep track of the auctions
    mapping(uint => Auction) auctions;

    uint auctionCount;

    /// @notice place a bid
    /// @param _id id of the auction
    function placeBid(uint _id) public payable returns (bool success) {
        //check 1. amout greater than least acceptable
        require(
            msg.value > auctions[_id].leastAcceptableBid,
            "amount less than the least acceptable by auctioneer"
        );
        //check 2. deadline hasn't passed
        require(isTimeLeft(_id), "auction period over");

        //check 3. is the bidder already in the array
        (bool found, int index) = isAddressFamiliar(msg.sender, _id);
        if (found) {
            auctions[_id].bidders[uint(index)].amount += msg.value;
            return success = true;
        }

        //add bidder to array
        Bidder memory bidder = Bidder(msg.sender, msg.value);
        auctions[_id].bidders.push(bidder);

        //if amount greater than highest bid, replace highest bid
        if (msg.value > auctions[_id].highestBidder.amount) {
            auctions[_id].highestBidder = bidder;
        }

        success = true;
    }

    /// @notice revoke a bid
    /// @param _id auction id
    function revokeBid(uint _id) public payable {
        (bool found, int index) = isAddressFamiliar(msg.sender, _id);
        require(found, "address not found in list of bidders");

        address caller = payable(msg.sender);
        (bool success, ) = caller.call{
            value: auctions[_id].bidders[uint(index)].amount
        }("");
        require(success, "unsuccessful sending ether to caller");

        auctions[_id].bidders[uint(index)].amount = 0; // ! reset the balances

        //check if he was the higest bidder
        address higestBidder = getHigestBider(_id);
        if (msg.sender == higestBidder) {
            console.log("highest bidder updated");
            auctions[_id].highestBidder = searchHigestBid(_id);
        }
    }

    /// @dev remove bidder from the bidders list
    /// @param _id the auction id
    function removeBidder(uint _id) public {
        (bool found, int index) = isAddressFamiliar(msg.sender, _id);
        require(found, "bidder not found");
        require(
            auctions[_id].bidders[uint(index)].amount <= 0,
            "revoke bid first"
        );

        int len = int(auctions[_id].bidders.length - 1); //! -1

        for (int i = index; i < len; i++) {
            auctions[_id].bidders[uint(i)] = auctions[_id].bidders[uint(i + 1)];
        }
        auctions[_id].bidders.pop();
    }

    /// @notice refund unsuccessful bidders if the time has elapased
    /// @dev only works when requested. for automatice refunds see @custom:function autoRefund()
    /// @param _id auction id
    function refundBidder(uint _id) public {
        //require time to have elapsed to begin the payouts
        require(
            !isTimeLeft(_id),
            "duration for which the auction is running not over yet"
        );

        //make sure that it isn't the bid winner
        require(
            msg.sender != auctions[_id].highestBidder.bidder,
            "cannot get refund as you are the bid winner"
        );

        //refund the caller since the time has already elapsed
        (bool found, int index) = isAddressFamiliar(msg.sender, _id);

        require(found, "address not found in bidders");

        (bool success, ) = msg.sender.call{
            value: auctions[_id].bidders[uint(index)].amount
        }("");

        //remove alice from the this
        auctions[_id].bidders[uint(index)].amount = 0;
        removeBidder(_id);

        require(success, "unable to refund you");
    }

    /// @notice return funds to bidders if auction duration elapses automatically
    /// @param _id auction id
    function autoRefund(uint _id) public {
        //todo
        // ! not tested
        //check that the time has elapsed and loop over bidders retuning their funds to them
        //excluding the highest bidder
        require(
            !isTimeLeft(_id),
            "duration for which the auction is running not over yet"
        );

        //find index of higest bider and skip him
        (, int index) = isAddressFamiliar(
            auctions[_id].highestBidder.bidder,
            _id
        );

        for (uint i = 0; i < auctions[_id].bidders.length; i++) {
            if (i == uint(index)) {
                continue;
            }
            (bool sucess, ) = auctions[_id].bidders[i].bidder.call{
                value: auctions[_id].bidders[i].amount
            }("");
            require(sucess, "error sending eth to address");

            auctions[_id].bidders[i].amount = 0; //update the balances
        }
    }

    ///@param _id auction id
    function timeRemaining(uint _id) public view returns (uint timeLeft) {
        if (isTimeLeft(_id)) {
            return timeLeft = auctions[_id].duration - block.timestamp / 1 days;
        }
        return timeLeft = 0;
    }

    /*
     * ADMING FUNCTIONS
     */
    /// @dev create a new auction
    /// @param name auction name
    /// @param leastAcceptableBid least amount the acutioneer is willing to accepter
    /// @param duration time period in days the auction will be active
    function createAuction(
        string calldata name,
        uint leastAcceptableBid,
        uint duration
    ) public {
        auctionCount++;

        //set the caller as the auctioneer
        auctions[auctionCount].auctioneer = payable(msg.sender);
        auctions[auctionCount].name = name;
        auctions[auctionCount].leastAcceptableBid = leastAcceptableBid;
        auctions[auctionCount].duration = duration;
    }

    /// @dev withdraw the funds from the auction
    /// @param _id the auction id
    function withDrawAuctionFunds(uint _id) public returns (bool cashedOut) {
        //require msg.sender to be auctioneer
        //require period to be elapsed
        //require time to have elapsed to begin the payouts
        require(
            !isTimeLeft(_id),
            "duration for which the auction is running not over yet"
        );

        require(
            msg.sender == auctions[_id].auctioneer,
            "only admins can cash out"
        );
        (bool success, ) = msg.sender.call{
            value: auctions[_id].highestBidder.amount
        }("");
        require(success, "error cashing out");
        cashedOut = true;
    }

    /// @dev update the duration of the auction
    /// @param _id the auction id
    /// @param _newDuration the new duration you want to set for the auction
    function updateAuctionDuration(uint _id, uint _newDuration) public {
        require(
            msg.sender == auctions[_id].auctioneer,
            "not the admin of requested auction"
        );

        auctions[_id].duration = _newDuration;
    }

    /*
     * internal functions
     */
    ///@param _id auction id
    function isTimeLeft(uint _id) private view returns (bool isTimeRemaining) {
        if (auctions[_id].duration > block.timestamp) {
            return isTimeRemaining = true;
        } else {
            return isTimeRemaining = false;
        }
    }

    /// @notice check if the address has placed bid before in the auction
    /// @param addressToCheck the address to check for
    /// @param addressToCheck the address to check for
    /// @return found was was the address found
    /// @return index if found the index of the bidder
    function isAddressFamiliar(
        address addressToCheck,
        uint _id
    ) private view returns (bool found, int index) {
        uint len = auctions[_id].bidders.length;

        for (uint i = 0; i < len; i++) {
            if (auctions[_id].bidders[i].bidder == addressToCheck) {
                return (found = true, index = int(i));
            }
        }
        return (false, -1);
    }

    /// @dev search for the higest bid
    /// @param _id auction id
    function searchHigestBid(uint _id) private view returns (Bidder memory) {
        uint len = auctions[_id].bidders.length;

        Bidder memory highestBidder = Bidder(address(0), 0);
        for (uint i = 0; i < len; i++) {
            if (auctions[_id].bidders[i].amount > highestBidder.amount) {
                highestBidder.amount = auctions[_id].bidders[i].amount;
                highestBidder.bidder = auctions[_id].bidders[i].bidder;
            }
        }
        return highestBidder;
    }

    /*
     * getter functions
     */
    /// @dev get the highest amount bidded so far
    /// @param _id the auction id
    /// @return highestBidAmt the highest bid amount that has been placed
    function getHigestBid(uint _id) public view returns (uint highestBidAmt) {
        highestBidAmt = auctions[_id].highestBidder.amount;
    }

    /// @dev get the address of the highest bidder
    /// @param _id the auction id
    /// @return highestBiderAddress address of the entity that has placed the bid
    function getHigestBider(
        uint _id
    ) public view returns (address highestBiderAddress) {
        highestBiderAddress = auctions[_id].highestBidder.bidder;
    }

    ///@param _id auction id
    function getBidAmt(uint _id) public view returns (uint bidAmt) {
        uint len = auctions[_id].bidders.length;

        for (uint index = 0; index < len; index++) {
            if (auctions[_id].bidders[index].bidder == msg.sender) {
                return auctions[_id].bidders[index].amount;
            }
        }
    }

    ///@notice number of auctions running
    function getAuctionCount() public view returns (uint count) {
        count = auctionCount;
    }

    /// @notice get number of bidders
    /// @param _id auction id
    function getNoBidders(uint _id) public view returns (uint bidderLength) {
        bidderLength = auctions[_id].bidders.length;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
