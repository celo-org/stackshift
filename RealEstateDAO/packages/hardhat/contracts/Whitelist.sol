//SPDX-License-Identifier: MIT
pragma solidity ^0.8.10;

import "@openzeppelin/contracts/access/Ownable.sol";
import "hardhat/console.sol";

/**
 * @title Whitelist
 * @dev The Whitelist contract has a whitelist of addresses, and provides basic authorization control functions.
 * @dev This simplifies the implementation of "user permissions".
 */

contract Whitelist is Ownable {
    mapping(address => bool) public whitelist;

    event WhitelistedAddressAdded(address addr);
    event WhitelistedAddressRemoved(address addr);

    /**
     * @dev Throws if called by any account that's not whitelisted.
     */
    modifier onlyWhitelisted() {
        require(whitelist[msg.sender], "no whitelist");
        _;
    }

    /**
     * @dev add an address to the whitelist
     * @param addr address
     */
    function addAddressToWhitelist(address addr) public onlyOwner returns (bool success) {
        if (!whitelist[addr]) {
            whitelist[addr] = true;
            emit WhitelistedAddressAdded(addr);
            success = true;
            console.log("success");
        }
    }

    /**
     * @dev add addresses to the whitelist
     * @param addrs addresses
     */
    function addAddressesToWhitelist(address[] memory addrs) public onlyOwner returns (bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (addAddressToWhitelist(addrs[i])) {
                success = true;
            }
        }
        return success;
    }

    /**
     * @dev remove an address from the whitelist
     * @param addr address
     */
    function removeAddressFromWhitelist(address addr) public onlyOwner returns (bool success) {
        if (whitelist[addr]) {
            whitelist[addr] = false;
            emit WhitelistedAddressRemoved(addr);
            success = true;
        }
        return success;
    }

    /**
     * @dev remove addresses from the whitelist
     * @param addrs addresses
     */
    function removeAddressesFromWhitelist(address[] memory addrs) public onlyOwner returns (bool success) {
        for (uint256 i = 0; i < addrs.length; i++) {
            if (removeAddressFromWhitelist(addrs[i])) {
                success = true;
            }
        }
        return success;
    }
}
