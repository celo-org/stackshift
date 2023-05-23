// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@redstone-finance/evm-connector/contracts/data-services/CustomUrlsConsumerBase.sol";

contract Membership is
    ERC721,
    ERC721URIStorage,
    Ownable,
    CustomUrlsConsumerBase
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    uint256 public lastAnswer;

    constructor() ERC721("Membership", "MMS") {}

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.pinata.cloud/ipfs/Qme74zLzhAU7umzG2GG96wTPtogV5xh7pKGvBRUEFGxZHX/";
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIdCounter.current();

        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.

    function _burn(
        uint256 tokenId
    ) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(
        uint256 tokenId
    ) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function updateMembership(uint256 tokenId) public onlyOwner {
        uint256 membership = getOracleNumericValueFromTxMsg(
            bytes32("0x1774675b9bc5ae5c")
        );

        lastAnswer = membership;

        string memory uri = "silver.json";

        if (membership == 0) {
            uri = "silver.json";
        } else if (membership == 10**8) {
            uri = "gold.json";
        } else if (membership == 20**8) {
            uri = "platinum.json";
        }

        _setTokenURI(tokenId, uri);
    }
}