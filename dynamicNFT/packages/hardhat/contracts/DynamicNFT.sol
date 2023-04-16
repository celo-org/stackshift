// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC1155/ERC1155.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Strings.sol";

contract DynamicNFT is ERC1155, Ownable {
    mapping (address => uint256) public funds;
    mapping(address => bool) public deposited;
    mapping (uint256 => string) private _uris;
  // Event to emit when money is received
    event MoneyReceived(address sender, uint256 amount);

    constructor()
        ERC1155("https://ipfs.io/ipfs/bafybeia7a7akgxffyyn6gk3rpesuz73dtzggn7gtbwfeig77k7to2nshj4/{id}.json")
    {}

    function setTokenURI(uint256 tokenId, string memory newURI) public onlyOwner {
        _uris[tokenId] = newURI;
    }

    function mint(address account, uint256 uriId)
        public
        onlyOwner
    {
        _mint(account, uriId, 1, "");
    }

    function mintBatch(address to, uint256[] memory ids, uint256[] memory amounts, bytes memory data)
        public
        onlyOwner
    {
        _mintBatch(to, ids, amounts, data);
    }

    function uri(uint256 _tokenid) override public pure returns (string memory) {
            return string(
                abi.encodePacked(
                    "https://ipfs.io/ipfs/bafybeia7a7akgxffyyn6gk3rpesuz73dtzggn7gtbwfeig77k7to2nshj4/",
                    Strings.toString(_tokenid),".json"
                )
            );
        }

    function depositFund() public payable {
        require(msg.value > 0, "Amount should be greater than zero");

        if(!deposited[msg.sender]){
            _mint(msg.sender, 1, 1, "");
             deposited[msg.sender] = true;
        }else {
         if (funds[msg.sender] <= 1 ) {
                setTokenURI(1, "https://ipfs.io/ipfs/bafybeia7a7akgxffyyn6gk3rpesuz73dtzggn7gtbwfeig77k7to2nshj4/1.json");
            } else if (funds[msg.sender] >= 2  && funds[msg.sender] < 3 ) {
                setTokenURI(2, "https://ipfs.io/ipfs/bafybeia7a7akgxffyyn6gk3rpesuz73dtzggn7gtbwfeig77k7to2nshj4/2.json");
            } else if (funds[msg.sender] >= 3 ) {
                setTokenURI(3, "https://ipfs.io/ipfs/bafybeia7a7akgxffyyn6gk3rpesuz73dtzggn7gtbwfeig77k7to2nshj4/3.json");
            }
        }
        funds[msg.sender] += msg.value;
    }


    // Function to receive money
    function receiveMoney() external payable {
        // Emit the event with the sender and amount
        emit MoneyReceived(msg.sender, msg.value);
    }

    function hasDeposited() public view returns(bool) {
        return deposited[msg.sender];
    }

    function getUserSavings() public view returns(uint256) {
        return funds[msg.sender];
    }
}