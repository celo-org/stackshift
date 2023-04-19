// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.10;

import "@openzeppelin/contracts@4.8.3/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts@4.8.3/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts@4.8.3/access/Ownable.sol";
import "@openzeppelin/contracts@4.8.3/utils/Counters.sol";

import {StringUtils} from "./StringUtils.sol";
import {Base64} from "./Base64.sol";
import "hardhat/console.sol";

contract CeloNameService is ERC721, ERC721Enumerable, ERC721URIStorage, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIds;

    string public tld;

    // We'll be storing our NFT images on chain as SVGs
    string svgPartOne =
        '<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" width="250px" height="250px" viewBox="0 0 250 250" version="1.1" style="background-color:#FCFF52"><defs><style type="text/css"></style></defs><g stroke="none" stroke-width="1" fill="none" fill-rule="evenodd"><rect fill="#FCFF52" x="0" y="0" width="100%" height="100%"/><g id="Group-6" transform="translate(70.000000, 154.000000)"><g id="Group" transform="translate(5.000000, 43.000000)"></g><defs><filter id="dropShadow" color-interpolation-filters="sRGB"><feDropShadow dx="0" dy="1" stdDeviation="2" flood-opacity="0.35" width="200%" height="200%"/></filter></defs><text text-anchor="middle" id="domain" font-family="Work Sans, sans-serif" font-size="25" font-weight="500" filter="url(#dropShadow)" fill="#1E002B"><tspan x="22.5%" y="-14">';

    string svgPartTwo =
        '</tspan></text></g></g><svg width="80" height="80" clip-rule="evenodd" fill-rule="evenodd" stroke-linejoin="round" stroke-miterlimit="2" viewBox="0 0 560 400" xmlns="http://www.w3.org/2000/svg"><g fill-rule="nonzero" transform="matrix(.284211 0 0 .284211 145 65)"><path d="m375 850c151.9 0 275-123.1 275-275s-123.1-275-275-275-275 123.1-275 275 123.1 275 275 275zm0 100c-207.1 0-375-167.9-375-375s167.9-375 375-375 375 167.9 375 375-167.9 375-375 375z" fill="#fbcc5c"/><path d="m575 650c151.9 0 275-123.1 275-275s-123.1-275-275-275-275 123.1-275 275 123.1 275 275 275zm0 100c-207.1 0-375-167.9-375-375s167.9-375 375-375 375 167.9 375 375-167.9 375-375 375z" fill="#35d07f"/><path d="m587.4 750c26-31.5 44.6-68.4 54.5-108.1 39.6-9.9 76.5-28.5 108.1-54.5-1.4 45.9-11.3 91.1-29.2 133.5-42.3 17.8-87.5 27.7-133.4 29.1zm-279.3-441.9c-39.6 9.9-76.5 28.5-108.1 54.5 1.4-45.9 11.3-91.1 29.2-133.4 42.3-17.8 87.6-27.7 133.4-29.2-26 31.5-44.6 68.4-54.5 108.1z" fill="#5ea33b"/></g></svg></svg>';

    mapping(string => address) public domains;
    mapping(string => string) public records;
    mapping(uint256 => string) public names;

    error Unauthorized();
    error AlreadyRegistered();
    error InvalidName(string name);

    // We make the contract "payable" by adding this to the constructor
    constructor(string memory _tld) ERC721("Celo Name Service", "CNS") {
        tld = _tld;
    }

    function safeMint(address to, string memory uri) public onlyOwner {
        uint256 tokenId = _tokenIds.current();
        _tokenIds.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
    }

    // The following functions are overrides required by Solidity.
    function _beforeTokenTransfer(address from, address to, uint256 tokenId, uint256 batchSize)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId, batchSize);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
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

    function withdraw() public onlyOwner {
        uint256 amount = address(this).balance;

        (bool success, ) = msg.sender.call{value: amount}("");
        require(success, "Failed to withdraw Celo");
    }

    // This function will give us the price of a domain based on length
    function price(string calldata name) public pure returns (uint256) {
        uint256 len = StringUtils.strlen(name);
        require(len > 0);
        if (len == 3) {
            return 5 * 10 ** 18; // 5 Celo to register a 3 character domain
        } else if (len == 4) {
            return 3 * 10 ** 18; // 3 Celo to register a 4 character domain
        } else {
            return 1 * 10 ** 18; // 1 Celo to register a 5-10 character domain
        }
    }

    function register(string calldata name) public payable {
        if (domains[name] != address(0)) revert AlreadyRegistered();
        if (!valid(name)) revert InvalidName(name);

        uint256 _price = price(name);
        require(msg.value >= _price, "Not enough Celo paid");

        // Combine the name passed into the function  with the TLD
        string memory _name = string(abi.encodePacked(name, ".", tld));
        // Create the SVG (image) for the NFT with the name
        string memory finalSvg = string(
            abi.encodePacked(svgPartOne, _name, svgPartTwo)
        );
        uint256 newRecordId = _tokenIds.current();
        uint256 length = StringUtils.strlen(name);
        string memory strLen = Strings.toString(length);
        string memory description = string(
            abi.encodePacked(
                "Introducing Celo Name service, a premium domain NFT on the Celo testnet! As a unique and valuable digital asset, this NFT offers exclusive ownership and control over the domain name ",
                _name,
                "."
            )
        );

        // Create the JSON metadata of our NFT. We do this by combining strings and encoding as base64
        string memory json = Base64.encode(
            bytes(
                string(
                    abi.encodePacked(
                        '{"name": "',
                        _name,
                        '", "description": "',
                        description,
                        '", "image": "data:image/svg+xml;base64,',
                        Base64.encode(bytes(finalSvg)),
                        '","length":"',
                        strLen,
                        '"}'
                    )
                )
            )
        );

        string memory finalTokenUri = string(
            abi.encodePacked("data:application/json;base64,", json)
        );

        _safeMint(msg.sender, newRecordId);
        _setTokenURI(newRecordId, finalTokenUri);
        domains[name] = msg.sender;
        names[newRecordId] = name;

        _tokenIds.increment();
    }

    // This will give us the domain owners' address
    function getAddress(string calldata name) public view returns (address) {
        return domains[name];
    }

    function setRecord(string calldata name, string calldata record) public {
        // Check that the owner is the transaction sender
        if (msg.sender != domains[name]) revert Unauthorized();
        records[name] = record;
    }

    function getRecord(
        string calldata name
    ) public view returns (string memory) {
        return records[name];
    }

    // Add this anywhere in your contract body
    function getAllNames() public view returns (string[] memory) {
        console.log("Getting all names from contract");
        string[] memory allNames = new string[](_tokenIds.current());
        for (uint256 i = 0; i < _tokenIds.current(); i++) {
            allNames[i] = names[i];
            console.log("Name for token %d is %s", i, allNames[i]);
        }

        return allNames;
    }

    function valid(string calldata name) public pure returns (bool) {
        return StringUtils.strlen(name) >= 3 && StringUtils.strlen(name) <= 10;
    }
}
