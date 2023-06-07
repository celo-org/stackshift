// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract NFTMarketplace is ERC1155 {
    using Counters for Counters.Counter;

    uint256 private constant COLLECTIONS_COUNT = 10;
    uint256 private constant PRICE_PER_NFT = 1 ether;

    mapping(uint256 => address) private collectionOwners;
    Counters.Counter private collectionIds;

    constructor() ERC1155("https://bafybeig7dmxlomwj77frr7froply7bkfy2gfxlmay2lxauba25fawt2yxy.ipfs.nftstorage.link/{id}.json") {
        // Mint 100 NFT collections
        for (uint256 i = 1; i <= COLLECTIONS_COUNT; i++) {
            _mint(msg.sender, i, 1, "");
            collectionOwners[i] = msg.sender;
            collectionIds.increment();
        }
    }

    function buy(uint256 collectionId) external payable {
        require(collectionId > 0 && collectionId <= COLLECTIONS_COUNT, "Invalid collection ID");
        require(collectionOwners[collectionId] != address(0), "Collection does not exist");
        require(msg.value == PRICE_PER_NFT, "Incorrect payment amount");

        // Transfer the NFT to the caller
        safeTransferFrom(collectionOwners[collectionId], msg.sender, collectionId, 1, "");

        // Transfer payment to the collection owner
        payable(collectionOwners[collectionId]).transfer(msg.value);

        // Update the collection owner
        collectionOwners[collectionId] = msg.sender;
    }
}