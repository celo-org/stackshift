// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {EnglishAuction} from "../src/EnglishAuction.sol";

contract EnglishAuctionTest is Test {
    // the english auction
    EnglishAuction public englishAuction;

    //users
    address alice = address(0x1);
    address bob = address(0x2);
    address mary = address(0x3);
    address auctioneer = address(0x4);

    //global variables

    function setUp() public {
        //akin to fixtures in hardhat
        englishAuction = new EnglishAuction();
    }

    function testCreateAuction() public {
        englishAuction.createAuction("Car Auction", 100_000, 20 days);
        englishAuction.createAuction("Land Auction", 1_000_000, 40 days);

        uint auctionCount = englishAuction.getAuctionCount();
        assertEq(auctionCount, 2);
        assertGt(auctionCount, 0);
    }

    function testPlaceBid() public {
        englishAuction.createAuction("Car Auction", 100_000, 20 days);

        address contractAddress = address(englishAuction);
        console.log("contract address", contractAddress);

        // englishAuction.call(abi.encodeWithSignature("",));
        // englishAuction.placeBid(1).call{value: 10};

        // (bool success, ) = contractAddress.call{value: 10}("placeBid(1)");
        // (bool success, ) = contractAddress.call{value: 10}("placeBid(1)");

        // (bool success, bytes memory data) = contractAddress.call{value: 100}(
        //     abi.encodeWithSignature("placeBid(uint)", 1)
        // );

         englishAuction.placeBid{value: 10}(1);
        

        // vm.mockCall(
        //     address(englishAuction),
        //     10,
        //     abi.encodeWithSelector(englishAuction.placeBid.selector),
        //     abi.encode(1)
        // );

        // uint amt = englishAuction.getBidder(1);
        // console.log("this is the amt found", amt);
        // englishAuction.placeBid(1)
    }
}
