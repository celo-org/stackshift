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
    uint minAcceptableValue = (1 / 100) * 1 ether; //? 0.01 eth
    uint bidAmt = 1 ether;
    uint aliceBidAmt = 15 ether;
    uint highestBid = 10000 ether;
    uint bobBidAmt = 30 ether;

    function setUp() public {
        //akin to fixtures in hardhat
        englishAuction = new EnglishAuction();

        //fund other addresses
        vm.deal(bob, 100 ether);
    }

    function testCreateAuction() public {
        englishAuction.createAuction("Car Auction", 100_000, 20 days);
        englishAuction.createAuction("Land Auction", 1_000_000, 40 days);

        uint auctionCount = englishAuction.getAuctionCount();
        assertEq(auctionCount, 2);
        assertGt(auctionCount, 0);
    }

    function testPlaceBid() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: bidAmt}(1);
        assertEq(bidAmt, englishAuction.getBidAmt(1));
    }

    function testAddingBidAmt() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: bidAmt}(1);
        englishAuction.placeBid{value: bidAmt}(1);
        englishAuction.placeBid{value: bidAmt}(1);
        englishAuction.placeBid{value: bidAmt}(1);

        uint len = englishAuction.getNoBidders(1);
        assertEq(len, 1);
    }

    function testHighestBidder() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: bidAmt}(1);

        //alice bids
        vm.startPrank(alice);
        vm.deal(alice, 20 ether);
        englishAuction.placeBid{value: aliceBidAmt}(1);

        uint higestBid = englishAuction.getHigestBid(1);
        assertEq(higestBid, aliceBidAmt);

        address higestBidder = englishAuction.getHigestBider(1);
        assertEq(address(higestBidder), address(alice));
    }

    function testRevokeBid() public payable {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: highestBid}(1);
        assertEq(englishAuction.getBidAmt(1), highestBid);

        englishAuction.revokeBid(1);
        assertEq(englishAuction.getBidAmt(1), 0);
    }

    function testUpdateHighestBidder() public payable {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: highestBid}(1);

        //alice bids
        vm.startPrank(alice);
        vm.deal(alice, 20 ether);
        englishAuction.placeBid{value: aliceBidAmt}(1);
        vm.stopPrank();

        vm.startPrank(bob);
        englishAuction.placeBid{value: bobBidAmt}(1);
        vm.stopPrank();

        englishAuction.revokeBid(1);
        assertEq(englishAuction.getBidAmt(1), 0);

        assertEq(englishAuction.getHigestBid(1), bobBidAmt);
    }

    function testRemoveBidder() public payable {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: highestBid}(1);

        englishAuction.revokeBid(1);

        englishAuction.removeBidder(1);

        //no bidders should be found
        assertEq(englishAuction.getNoBidders(1), 0);
    }

    function testRemoveBidderFails() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: highestBid}(1);

        vm.expectRevert(); //fails because balance isn't zero
        englishAuction.removeBidder(1);
    }

    //will only refund when requested
    function testRefundBidder() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: bidAmt}(1);

        vm.startPrank(bob);
        englishAuction.placeBid{value: bobBidAmt}(1);
        vm.stopPrank();

        //alice bids
        uint aliceGets = 20 ether;
        vm.startPrank(alice);
        vm.deal(alice, aliceGets);
        englishAuction.placeBid{value: aliceBidAmt}(1);
        assertEq(address(alice).balance, aliceGets - aliceBidAmt);

        vm.warp(21 days);

        englishAuction.refundBidder(1);
        assertEq(address(alice).balance, aliceGets);
    }

    function testWithdrawFunds() public {
        englishAuction.createAuction(
            "Car Auction",
            minAcceptableValue,
            20 days
        );

        englishAuction.placeBid{value: bidAmt}(1);

        vm.startPrank(bob);
        englishAuction.placeBid{value: bobBidAmt}(1);
        vm.stopPrank();

        //alice bids
        uint aliceGets = 20 ether;
        vm.startPrank(alice);
        vm.deal(alice, aliceGets);
        englishAuction.placeBid{value: aliceBidAmt}(1);
        assertEq(address(alice).balance, aliceGets - aliceBidAmt);

        vm.warp(21 days);

        englishAuction.refundBidder(1);
        assertEq(address(alice).balance, aliceGets);
        vm.stopPrank();

        bool cashedOut = englishAuction.withDrawAuctionFunds(1);
        assertTrue(cashedOut);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
