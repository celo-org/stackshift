// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@redstone-finance/evm-connector/contracts/data-services/CustomUrlsConsumerBase.sol";

contract JustinNFT is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage,
    CustomUrlsConsumerBase
{
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;

    struct Product {
        string name;
        string imagePath;
        uint256 price;
    }

    Product[] public products;

    mapping(address => uint256) public purchaseCounts;

    mapping(address => bool) public userMinted;


    constructor() ERC721("Membership", "MMS") {
        products.push(Product("Gucci Bag", "gucci.png", 30000000000000000));
        products.push(Product("Zara Bag", "zara.png", 40000000000000000));
        products.push(Product("Nike Shoe", "nike.png", 50000000000000000));
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://gateway.pinata.cloud/ipfs/QmcEoV3W8ToCdqHq88wFPp8DdnouhpFvCjtGArZFqaHJif/";
    }

    // The following functions are overrides required by Solidity.

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId) public view override(ERC721, ERC721URIStorage) returns (string memory) {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
        {
            return super.supportsInterface(interfaceId);
        }

     function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
        {
            super._beforeTokenTransfer(from, to, tokenId, batchSize);
        }

    function buyProduct(address _nftAddress, uint256 _productIndex) public payable {

        Product memory product = products[_productIndex];

        require(product.price == msg.value, "Incorrect product amount");

        uint256 point = purchaseCounts[msg.sender];

        if (userMinted[msg.sender]) {

        uint256 tokenId = ERC721Enumerable(_nftAddress).tokenOfOwnerByIndex(msg.sender, 0);

        // Check if user can be upgraded.

        if (point > 20) {
            string memory uri = "gold.json";
            _setTokenURI(tokenId, uri);
        } else {
            string memory uri = "platinum.json";
            _setTokenURI(tokenId, uri);
        }

        } else {

            uint256 tokenId = 0;
            string memory uri = "silver.json";
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uri);
            userMinted[msg.sender] = true;
        }
        purchaseCounts[msg.sender] ++;
    }

    function getProducts() public view returns(Product[] memory) {
        return products;
    }

    function getTokenId() public view returns (uint256) {

        require(userMinted[msg.sender], "User has not NFT");

        // User will always have 1 token.
        uint256 tokenIndex = 0;

        return tokenOfOwnerByIndex(msg.sender, tokenIndex);

    }

}