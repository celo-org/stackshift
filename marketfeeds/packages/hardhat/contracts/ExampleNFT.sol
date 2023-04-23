// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";

contract ExampleNFT is ERC721Enumerable {
  uint256 private nextTokenId = 1;

  constructor() ERC721("ExampleNFT", "ENFT") {}

  function mint() external {
    _mint(msg.sender, nextTokenId);
    nextTokenId++;
  }
}
