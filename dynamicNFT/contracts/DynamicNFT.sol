// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicNFT is ERC1155, Ownable {
    uint256 public constant MAX_SUPPLY = 10000;
    uint256 public totalSupply;
    uint256 public mintPrice;
    uint256 public blockNumber;
    uint256 public minterCount;

    mapping(uint256 => string) private tokenURI;

    event Mint(address indexed minter, uint256 amount);

    constructor(uint256 _mintPrice) ERC1155("https://gateway.pinata.cloud/ipfs/QmcHxvtNb8Eg9XZnprFeudokeGGb2P7J8w4FDhHDR35DbY/lagos.json") {
        mintPrice = _mintPrice;
        blockNumber = block.number;
    }

    function mint(uint256 amount) public payable {
        require(totalSupply + amount <= MAX_SUPPLY, "Minting would exceed max supply");
        require(msg.value == amount * mintPrice, "Insufficient ether to mint tokens");

        for (uint256 i = 0; i < amount; i++) {
            uint256 tokenId = totalSupply + 1;
            _mint(msg.sender, tokenId, 1, "");
            totalSupply++;
        }

        emit Mint(msg.sender, amount);
    }

    function mintTo(uint256 numOfNfts, address toAddress)
        external
        onlyOwner
    {
        require(
            totalSupply + numOfNfts <= MAX_SUPPLY,
            "Minting would exceed max supply"
        );
        require(numOfNfts > 0, "Must mint at least one NFT");

        for (uint256 i = 0; i < numOfNfts; i++) {
            uint256 tokenId = totalSupply + 1;
            _mint(toAddress, tokenId, 1, "");
            tokenId += 1;
        }
    }

    function setTokenURI(uint256 tokenId, string memory tokenUri) public onlyOwner {
        tokenURI[tokenId] = tokenUri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(0), tokenURI[tokenId]));
    }
}
