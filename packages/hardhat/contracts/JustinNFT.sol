//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "hardhat/console.sol";
import "@openzeppelin/contracts/utils/Counters.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/ERC721.sol";

contract JustinNFT is ERC721, ERC721Enumerable, ERC721URIStorage {

    using Counters for Counters.Counter;

    // _NFTIdCounter variable has the most recent minted tokenId
    Counters.Counter private _NFTIdCounter;

    // Keeps track of the number of items sold on the marketplace
    Counters.Counter private _itemsSold;

    // Avoid Reentrant attack
    bool internal locked;

    // Owner is the contract address that created the smart contract
    address payable owner;

    // The fee charged by the marketplace to be allowed to list an NFTCard
    uint256 listPrice = 0.01 ether;

    // The structure to store info about a listed token
    struct ListedNFT {
        uint256 NFTId;
        address payable seller;
        uint256 price;
        bool forSale;
    }

    struct MyNFT {
        uint256 NFTId;
        address payable seller;
        uint256 price;
        bool forSale;
        bool sold;
    }

    // For tracing the metric of a creator.
    struct Seller {
        uint256 sales;
        uint256 earnings;
        uint256 NFTCounts;
    }

    // The event emitted when a token is successfully listed
    event NFTListedSuccess (
        uint256 indexed tokenId,
        address seller,
        uint256 price,
        bool forSale
    );

    // This mapping maps tokenId to token info and is helpful when retrieving details about a tokenId
    mapping(uint256 => ListedNFT) private idToListedNFT;

    // Maps address to NFT creator/collector
    mapping(address => mapping(uint256 => MyNFT)) public myNFTs;

    // Maps address to NFT seller
    mapping(address => Seller) sellers;

    constructor() ERC721("ArtisansNFTMarketplace", "ANTMKT") {
        owner = payable(msg.sender);
    }

    // Required overrides functions

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
    // Required overrides functions ends here


    function getListPrice() public view returns (uint256) {
        return listPrice;
    }

    function getNFT(uint256 NFTId) public view returns (
        uint256 _NFTId,
        address _seller,
        uint256 _price,
        bool _forSale,
        uint256 _sales,
        uint256 _earnings
    ) {
        ListedNFT memory _nft = idToListedNFT[NFTId];

        Seller memory _NFTseller = sellers[_nft.seller];

        return (
        _nft.NFTId,
        _nft.seller,
        _nft.price,
        _nft.forSale,
        _NFTseller.sales,
        _NFTseller.earnings
        );
    }

    function getNFTCount() public view returns (uint256) {
        return _NFTIdCounter.current();
    }

    function createNFT(string memory NFTURI, uint256 price) public payable returns (uint) {

        _NFTIdCounter.increment();

        uint256 newNFTId = _NFTIdCounter.current();

        _safeMint(msg.sender, newNFTId);

        _setTokenURI(newNFTId, NFTURI);

        idToListedNFT[newNFTId] = ListedNFT(newNFTId, payable(msg.sender), price, false );

        myNFTs[msg.sender][newNFTId] = MyNFT(newNFTId, payable(msg.sender), price, false, false);

        Seller storage _NFTseller = sellers[msg.sender];

        _NFTseller.NFTCounts ++;

        return newNFTId;
    }

    function getMyNFTs (uint256 _index, address _callerAddress) public view returns (

        uint256 _NFTId,
        address _seller,
        uint256 _price,
        bool _forSale,
        bool _sold,
        uint256 _sales,
        uint256 _earnings
    ) {

        Seller storage _NFTseller = sellers[_callerAddress];
        MyNFT storage _myNFT = myNFTs[_callerAddress][_index];

        return (
        _myNFT.NFTId,
        _myNFT.seller,
        _myNFT.price,
        _myNFT.forSale,
        _myNFT.sold,
        _NFTseller.sales,
        _NFTseller.earnings
        );

    }

    function buyNFT(uint256 tokenId) public noReentrant payable {
        ListedNFT storage _listedNFT = idToListedNFT[tokenId];
        address seller = idToListedNFT[tokenId].seller;
        require(msg.value == _listedNFT.price, "Please submit the asking price in order to complete the purchase");

        // Update the details of the token.
        _listedNFT.forSale = false;
        _listedNFT.seller = payable(msg.sender);
        _itemsSold.increment();

        // Transfer the token to the contract.
        _transfer(address(this), msg.sender, tokenId);

        // Transfer the proceeds from the sale to the seller of the NFTCard.
        payable(seller).transfer(msg.value);

        myNFTs[msg.sender][tokenId] = MyNFT(tokenId, payable(msg.sender), _listedNFT.price, false, false);
        myNFTs[seller][tokenId] = MyNFT(tokenId, payable(seller), _listedNFT.price, false, true);

        Seller storage _seller = sellers[seller];
        Seller storage _buyer = sellers[msg.sender];

        _seller.sales ++;
        _seller.earnings += _listedNFT.price;
        _buyer.NFTCounts ++;
    }

    function sellNFT(uint256 tokenId) public noReentrant payable {

        ListedNFT storage _listedNFT = idToListedNFT[tokenId];

        require(_listedNFT.price > 0, "Make sure the price isn't negative");
        require(msg.value == listPrice, "Hopefully sending the correct price");
        require(_listedNFT.seller == msg.sender, "Only NFT owners can perform this operation");
        require(_listedNFT.forSale == false, "Item already listed for sale");

        MyNFT storage _myNFT = myNFTs[msg.sender][tokenId];

        payable(owner).transfer(listPrice);
        _transfer(msg.sender, address(this), tokenId);
        _listedNFT.forSale = true;
        _myNFT.forSale = true;

        emit NFTListedSuccess(
            tokenId,
            msg.sender,
            _listedNFT.price,
            true
        );
    }

    function cancel(uint256 tokenId) public {

        ListedNFT storage _listedNFT = idToListedNFT[tokenId];

        require(_listedNFT.seller == msg.sender, "Only NFT owners can perform this operation");
        require(_listedNFT.forSale == true, "Item not listed for sale");

        MyNFT storage _myNFT = myNFTs[msg.sender][tokenId];

        _transfer(address(this), msg.sender, tokenId);
        _listedNFT.forSale = false;
        _myNFT.forSale = false;
    }



    function getMyNFTCount(address _address) public view returns (uint256) {

        Seller storage _NFTseller = sellers[_address];
        return _NFTseller.NFTCounts;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }
}


// TODO: update listing price