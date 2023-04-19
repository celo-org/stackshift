// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract DynamicNFT is ERC1155, Ownable {
    
    struct TokenData {
        uint256 maxSupply;
        uint256 currentSupply;
        uint256 blockLimit;
        uint256 mintingFee;
        uint256 maxMinters;
        address[] minters;
        mapping(address => bool) isMinter;
    }

    mapping(uint256 => TokenData) private tokenData;
    mapping(uint256 => string) private tokenURI;

    constructor(string memory uri) ERC1155(uri) {}

    function mint(uint256 tokenId) public payable {
        TokenData storage data = tokenData[tokenId];
        require(data.currentSupply < data.maxSupply, "Token at max supply");
        require(data.isMinter[msg.sender], "You are not authorised to mint this token");
        require(data.mintingFee == msg.value, "Invalid minting fee");
        require(getMintersLength(tokenId) <= data.maxMinters, "Max minters reached");
        require(block.number <= data.blockLimit, "Minting window closed");
        _mint(msg.sender, tokenId, 1, "");
        data.currentSupply++;
        
    }

    function setTokenMaxSupply(uint256 tokenId, uint256 maxSupply) public onlyOwner {
        tokenData[tokenId].maxSupply = maxSupply;
    }

    function setTokenBlockLimit(uint256 tokenId, uint256 blockLimit) public onlyOwner {
        tokenData[tokenId].blockLimit = blockLimit;
    }

    function setTokenMaxMinters(uint256 tokenId, uint256 maxMinters) public onlyOwner {
        tokenData[tokenId].maxMinters = maxMinters;
    }

    function setTokenMintingFee(uint256 tokenId, uint256 mintingFee) public onlyOwner {
        tokenData[tokenId].mintingFee = mintingFee;
    }

    function addMinter(uint256 tokenId, address minter) public onlyOwner {
        TokenData storage data = tokenData[tokenId];
        require(!data.isMinter[minter], "Minter already exists");
        data.minters.push(minter);
        data.isMinter[minter] = true;
    }

    function removeMinter(uint256 tokenId, address minter) public onlyOwner {
        TokenData storage data = tokenData[tokenId];
        require(data.isMinter[minter], "Minter does not exist");
        for (uint256 i = 0; i < data.minters.length; i++) {
            if (data.minters[i] == minter) {
                data.minters[i] = data.minters[data.minters.length - 1];
                data.minters.pop();
                break;
            }
        }
        data.isMinter[minter] = false;
    }

    function getMinters(uint256 tokenId) public view returns (address[] memory) {
        return tokenData[tokenId].minters;
    }

    function getMintersLength(uint256 tokenId) public view returns (uint256) {
        return tokenData[tokenId].minters.length;
    }

    function setTokenURI(uint256 tokenId, string memory tokenUri) public onlyOwner {
        tokenURI[tokenId] = tokenUri;
    }

    function uri(uint256 tokenId) public view override returns (string memory) {
        return string(abi.encodePacked(super.uri(0), tokenURI[tokenId]));
    }
}
