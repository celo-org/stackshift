// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

  /// @title Auction NFT contract 
  /// @author Glory Praise Emmanuel
  /// @dev An ERC721 NFT contract

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
contract AuctionNFT  is ERC721, Ownable {

    constructor(string memory _name, string memory _symbol) ERC721(_name, _symbol) {
    }

    ///  @dev mint to a random address with the safeMint function
    function safeMint(address to) public {
        uint256 tokenId = 20;
        _safeMint(to, tokenId);
    }

}