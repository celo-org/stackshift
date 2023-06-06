// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";
import "./Whitelist.sol";

contract DAONFT is ERC721URIStorage, Ownable, Whitelist {
    using Counters for Counters.Counter;

    Counters.Counter private tokenIds;

    /**
     * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    string _baseTokenURI;
    address public marketAddress;
    uint256 public price = 0.1 ether;

    event Minted(uint256 indexed tokenId, address indexed addr);

    constructor(string memory baseURI) ERC721("DAONFT", "DNFT") {
        _baseTokenURI = baseURI;
    }

    function mint() public payable {
        require(price <= msg.value, "Insufficient amount sent");
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        tokenIds.increment();
        emit Minted(newTokenId, msg.sender);
    }

    function mintMany(uint256 num) external payable {
        require(price * num <= msg.value, "Insufficient amount sent");
        if (num == 1) {
            mint();
        } else {
            for (uint256 i = 0; i < num; i++) {
                mint();
            }
        }
    }

    function withdraw(uint256 _amount) public onlyWhitelisted {
        (bool success,) = msg.sender.call{value: _amount}("");
        require(success, "Failed to send Ether");
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function setBaseURI(string memory val) public onlyOwner {
        _baseTokenURI = val;
    }

    function setPrice(uint256 val) public onlyOwner {
        price = val;
    }

    function tokenURI(uint256 tokenId) public view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
