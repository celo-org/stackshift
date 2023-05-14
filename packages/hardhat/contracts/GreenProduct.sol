// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract GreenProduct is
    ERC721,
    ERC721Enumerable,
    ERC721URIStorage
{

    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;

    struct Product {
        string name;
        string imagePath;
        uint256 price;
    }

    Product[] public products;

    mapping(address => bool) public userMinted;


    constructor() ERC721("GreenProduct", "GP") {
        products.push(Product("Energy Saver", "energysaver.jpg", 30000000000000000));
        products.push(Product("Deforester", "reforest.jpg", 40000000000000000));
        products.push(Product("Neva Waste", "nevawaste.jpg", 50000000000000000));
    }

    function _baseURI() internal pure override returns (string memory) {
        return
            "https://ipfs.io/ipfs/QmUPHAUomY9XsddpVey8NEmNVLrXhViW8onXemCuvFP99L/";
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

    function buyProduct(address _nftAddress, uint256 _productIndex, uint256 _retireCounts) public payable {

        Product memory product = products[_productIndex];

        require(product.price == msg.value, "Incorrect product amount");

        if (userMinted[msg.sender]) {

        uint256 tokenId = ERC721Enumerable(_nftAddress).tokenOfOwnerByIndex(msg.sender, 0);

        // Check if user can be upgraded.

        if (_retireCounts < 2) {
            string memory uri = "nft1.json";
            _setTokenURI(tokenId, uri);
        } else if (_retireCounts < 3) {
            string memory uri = "nft2.json";
            _setTokenURI(tokenId, uri);
        } else {
            string memory uri = "nft3.json";
            _setTokenURI(tokenId, uri);
        }

        } else {

            uint256 tokenId = _tokenIds.current();
            string memory uri = "nft1.json";
            _safeMint(msg.sender, tokenId);
            _setTokenURI(tokenId, uri);
            userMinted[msg.sender] = true;
            _tokenIds.increment();
        }

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