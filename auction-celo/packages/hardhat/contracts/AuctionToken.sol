// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

/**
 * @notice A simple ERC20 Token implementation that also accepts donation for the project
 */
contract AuctionToken is ERC20 {
    uint sentInBid;
    address payable owner;

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() ERC20("AuctionToken Token", "AUT") {
        /// @notice mint 10000 tokens to the owner
        _mint(msg.sender, 10000e18);
        owner = payable(msg.sender);
        sentInBid = 0;
    }

    function acceptBid(uint amount)
        public
        payable
        returns (bool accepted)
    {
        require(amount == msg.value, "Invalid amount!");

        sentInBid += msg.value;

        return true;
    }

    function withdrawChest() public onlyOwner returns (bool) {
        bool success = owner.send(address(this).balance);

        if (success) return true;

        return false;
    }
}
