// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import "openzeppelin-contracts/contracts/utils/math/SafeMath.sol";
import "openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol";

import {FractionalizedNFT} from "../src/FractionalizedNFT.sol";
import {Kobeni} from "../src/NFT.sol";

contract KobeniTest is Test, ERC721Holder {
    FractionalizedNFT fractionalizedNFT;
    Kobeni kobeniCollection;

    address alice = address(0x1);
    address bob = address(0x2);

    function setUp() public {
        fractionalizedNFT = new FractionalizedNFT();
        kobeniCollection = new Kobeni();
    }

    function test_setUpDoneCorrectly() public {}

    // function test_divisionOfnums() public pure {
    //     uint assetPrice = 1000;
    //     uint amount = 999;
    //     require(amount < assetPrice, "amount greater than the asset price");
    // }

    function test_viewTotalAssets() public {
        // assertEq(fractionalizedNFT.totalAssets, 0);
        uint totalAssets = fractionalizedNFT.totalAssets();
        assertEq(totalAssets, 0);
    }

    function test_listForAuction() public {
        mintNft(address(this));

        //!approve the transfer
        kobeniCollection.approve(address(fractionalizedNFT), 0);

        bool success = fractionalizedNFT.listForFractionalization(
            0,
            address(kobeniCollection),
            1000
        );
        assertTrue(success);

        uint remainingPosition = fractionalizedNFT.getRemainingPosition(
            address(kobeniCollection),
            0
        );

        assertEq(remainingPosition, 1000);
    }

    function test_buyShareIntoNft() public {
        test_listForAuction();

        vm.startPrank(alice);
        vm.deal(alice, 1000);

        fractionalizedNFT.buyIn{value: 500}(address(kobeniCollection), 0);

        uint remainingPosition = fractionalizedNFT.getRemainingPosition(
            address(kobeniCollection),
            0
        );

        //testing the remaining position
        assertEq(remainingPosition, 500);

        //check out the perecen
        uint alicePercentageOwnership = fractionalizedNFT
            .getOwnershipPercentage(
                address(kobeniCollection),
                0,
                address(alice)
            );
        assertEq(alicePercentageOwnership, 50);
        vm.stopPrank();

        //bob also wants to purchase shares in the nft
        vm.startPrank(bob);
        vm.deal(bob, 500);

        fractionalizedNFT.buyIn{value: 250}(address(kobeniCollection), 0);
        uint remainingPosition2 = fractionalizedNFT.getRemainingPosition(
            address(kobeniCollection),
            0
        );
        assertEq(remainingPosition2, 250);

        uint bobPercentageOwnership = fractionalizedNFT.getOwnershipPercentage(
            address(kobeniCollection),
            0,
            address(bob)
        );
        assertEq(bobPercentageOwnership, 25);
        vm.stopPrank();
    }

    function mintNft(address _mintTo) private {
        string
            memory uri = "https://gateway.pinata.cloud/ipfs/QmSa98sg5kS3n3rrsdf26rLSvtz6AZ9PoFBTkouocCnJrP";
        kobeniCollection.safeMint(_mintTo, uri);
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
