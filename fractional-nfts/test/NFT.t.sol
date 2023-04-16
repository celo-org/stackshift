// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "forge-std/Test.sol";
import {Kobeni} from "../src/NFT.sol";

contract KobeniTest is Test {
    Kobeni kobeniCollection;

    address alice = address(0x1);

    function setUp() public {
        kobeniCollection = new Kobeni();
    }

    function test_setUpDoneCorrectly() public {
        uint total = kobeniCollection.totalSupply();
        assertEq(total, 0);
    }

    function test_safeMint() public {
        string
            memory uri = "https://gateway.pinata.cloud/ipfs/QmSa98sg5kS3n3rrsdf26rLSvtz6AZ9PoFBTkouocCnJrP";
        kobeniCollection.safeMint(alice, uri);

        uint total = kobeniCollection.totalSupply();
        assertEq(total, 1);

        string memory fetchedUri = kobeniCollection.tokenURI(0);
        assertEq(uri, fetchedUri);
    }
}
