// SPDX-License-Identifier: MIT

pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "@openzeppelin/contracts/utils/Base64.sol";

contract OnchainNames is ERC721URIStorage {
    using Strings for uint256;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    uint256 public tokenIds;

    mapping(uint256 => NFTData) public _nftData;
    mapping(address => mapping(uint256 => NFTData)) _addressTonftData;

    mapping(uint256 => string) public names;

    struct NFTData {
        uint id;
        string name;
        string description;
        string image;
        address minter;
        uint256 minted;
    }

    constructor() ERC721("Onchain Names", "ONCN") {}

    function generateCharacter(
        uint256 tokenId
    ) public view returns (string memory) {
        bytes memory svg = abi.encodePacked(
            '<svg xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMinYMin meet" viewBox="0 0 350 350">',
            "<style>.base { fill: white; font-family: serif; font-size: 14px; }</style>",
            '<rect width="100%" height="100%" fill="black" />',
            '<text x="50%" y="40%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Minter Details",
            "</text>",
            '<text x="50%" y="50%" class="base" dominant-baseline="middle" text-anchor="middle">',
            "Name: ",
            getNames(tokenId),
            "</text>",
            "</svg>"
        );
        return
            string(
                abi.encodePacked(
                    "data:image/svg+xml;base64,",
                    Base64.encode(svg)
                )
            );
    }

    function getNames(uint256 tokenId) public view returns (string memory) {
        string memory name = names[tokenId];
        return name;
    }

    function getTokenURI(uint256 tokenId) public view returns (string memory) {
        NFTData memory nftData = _nftData[tokenId];

        bytes memory dataURI = abi.encodePacked(
            "{",
            '"name": "Minter #',
            tokenId.toString(),
            '",',
            '"description": "',
            nftData.description,
            '"',
            '"image": "',
            generateCharacter(tokenId),
            '"',
            "}"
        );
        return
            string(
                abi.encodePacked(
                    "data:application/json;base64,",
                    Base64.encode(dataURI)
                )
            );
    }

    function mintNft(string memory name, string memory description) public {
        tokenIds++;
        _tokenIds.increment();
        uint256 tokenId = _tokenIds.current();
        names[tokenId] = name;
        string memory Image = generateCharacter(tokenId);
        _safeMint(msg.sender, tokenId);
        _nftData[tokenId] = NFTData(
            tokenId,
            name,
            description,
            Image,
            msg.sender,
            block.timestamp
        );
        _addressTonftData[msg.sender][tokenId] = NFTData(
            tokenId,
            name,
            description,
            Image,
            msg.sender,
            block.timestamp
        );

        // generate the token uri
        string memory tokenURI = getTokenURI(tokenId);
        _setTokenURI(tokenId, tokenURI);
    }

    function seeYourNft(
        uint256 tokenid
    ) public view returns (NFTData[] memory) {
        NFTData memory nft = _addressTonftData[msg.sender][tokenid];
        NFTData[] memory arr = new NFTData[](1);
        arr[0] = nft;

        return arr;
    }

    function seeNFTs() public view returns (NFTData[] memory) {
        NFTData[] memory arr = new NFTData[](tokenIds);

        for (uint256 i = 0; i < tokenIds; i++) {
            arr[i] = _nftData[i + 1];
        }
        return arr;
    }
}
