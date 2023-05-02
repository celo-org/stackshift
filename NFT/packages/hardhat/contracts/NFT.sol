// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract RNFT is ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;
    Counters.Counter private tokenIds;

    /**
     * @dev _baseTokenURI for computing {tokenURI}. If set, the resulting URI for each
     * token will be the concatenation of the `baseURI` and the `tokenId`.
     */
    string _baseTokenURI;

    event Minted(uint256 indexed tokenId, address indexed addr);
    mapping(address => bool) NFTHolders;
    mapping(address => uint) TimeStore;

    constructor(string memory baseURI) ERC721("RandomNFT", "RNFT") {
        _baseTokenURI = baseURI;
    }

    function mint() public {
        require(NFTHolders[msg.sender] == false, "You have minted an NFT");
        TimeStore[msg.sender] = block.number;
        uint256 newTokenId = tokenIds.current();
        _mint(msg.sender, newTokenId);
        NFTHolders[msg.sender] = true;
        tokenIds.increment();
        emit Minted(newTokenId, msg.sender);
    }

    /**
     * @dev _baseURI overides the Openzeppelin's ERC721 implementation which by default
     * returned an empty string for the baseURI
     */
    function _baseURI() internal view virtual override returns (string memory) {
        return _baseTokenURI;
    }

    function tokenURI(
        uint256 tokenId
    ) public view virtual override returns (string memory) {
        string memory t;
        if ((TimeStore[msg.sender] + tokenId) % 2 == 0) {
            t = string(abi.encodePacked(Strings.toString(0), ".json"));
        } else {
            t = string(abi.encodePacked(Strings.toString(1), ".json"));
        }
        return
            bytes(_baseTokenURI).length > 0
                ? string(abi.encodePacked(_baseTokenURI, t))
                : "";
    }

    function setBaseURI(string memory val) public onlyOwner {
        _baseTokenURI = val;
    }
}
