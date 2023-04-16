// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.13;

import "openzeppelin-contracts/contracts/token/ERC721/utils/ERC721Holder.sol";
import "openzeppelin-contracts/contracts/token/ERC721/IERC721.sol";
import "openzeppelin-contracts/contracts/utils/math/SafeMath.sol";

///
///
contract FractionalizedNFT is ERC721Holder {
    /// @notice holds info about the asset up for fractionalization
    struct AssetData {
        address initialOwner;
        uint totalBought;
        uint assetPrice;
        mapping(address => uint) ownershipPercentage;
        bool cashedOut;
    }

    /// @notice holds the assets listedasset.
    /// @dev using a mapping cheaper than an array
    /// @dev collectionAddress => nftId > ownership Data
    mapping(address => mapping(uint => AssetData)) _assets;

    //TODO
    struct OfferPosion {
        uint position; //percentage you own
        uint amountOffered; //% percentage you want to sell
    }

    /// @notice hold the positions if a fractional owner wants to sell it
    mapping(address => uint) positions;

    uint public totalAssets = 0;

    /// @notice check if the caller owns the nft
    modifier onlyNFTOwner(uint256 _tokenId, address collectionAddress) {
        require(
            IERC721(collectionAddress).ownerOf(_tokenId) == msg.sender,
            "Only NFT owner can call this function"
        );
        _;
    }

    constructor() {} // TODO

    /// @notice user listing an NFT looking for buyyers
    /// @param _nftId nft id being listed
    /// @param _collectionAddress of the nft being listed
    /// @param _assetPrice set the price of the nft
    /// @return success result of this operation
    ///! else infinity if set to zero
    function listForFractionalization(
        uint _nftId,
        address _collectionAddress,
        uint _assetPrice
    ) public onlyNFTOwner(_nftId, _collectionAddress) returns (bool success) {
        // increase no of assets
        totalAssets++;

        //initialize the asset data
        AssetData storage asset = _assets[_collectionAddress][_nftId];
        asset.initialOwner = msg.sender;
        asset.assetPrice = _assetPrice;

        //treansfer asset to this contract
        IERC721(_collectionAddress).safeTransferFrom(
            msg.sender,
            address(this),
            _nftId
        );

        //we are now the new owners of the nft
        success = IERC721(_collectionAddress).ownerOf(_nftId) == address(this);
        require(success, "listing failed");
    }

    /// @notice
    /// @param _collectionAddress address of the collection
    /// @param _nftId the id you want to buy into
    function buyIn(address _collectionAddress, uint _nftId) public payable {
        require(msg.value > 0, "need balance greater than zero to buy in");

        //check if we own the requested nft
        require(
            IERC721(_collectionAddress).ownerOf(_nftId) == address(this),
            "requested nft not found"
        );

        //calculate the percentage
        uint percentage = calculatePercentage(
            _nftId,
            _collectionAddress,
            msg.value
        );

        // add to map of owners if everything went according to plan
        _assets[_collectionAddress][_nftId].ownershipPercentage[
            msg.sender
        ] = percentage;

        //update the total amout send for ownership of this asset
        _assets[_collectionAddress][_nftId].totalBought += msg.value;
    }

    // TODO buy offered position
    function buyPosition() public {}

    //todo function to offer your position
    function offerPosition() public {}

    /// @notice calculate the percentage ownership the caller gets
    /// @dev he can only go down
    /// @param _nftId that owner wants to change
    /// @param _collectionAddress the collection address
    /// @param _amount the price sent for ownership
    function calculatePercentage(
        uint _nftId,
        address _collectionAddress,
        uint _amount
    ) public view returns (uint) {
        uint assetPrice = _assets[_collectionAddress][_nftId].assetPrice;
        uint remaining = getRemainingPosition(_collectionAddress, _nftId);

        require(
            _amount < remaining,
            "amount greater than available share of nft remaining"
        );

        // (bool success, uint res) = SafeMath.tryDiv(amount * 100, assetPrice);
        (bool success, uint percentage) = SafeMath.tryDiv(
            _amount * 100,
            assetPrice
        );
        require(success, "error calculating percentage of owning the nft");
        return percentage;
    }

    /*
     * ADMIN
     */
    /// @notice withdraw the amount that has purchased for an nft
    /// @dev wait till the shares bought equal the asset price to cash out
    function withdraw(address _collectionAddress, uint _nftId) public {
        require(
            _assets[_collectionAddress][_nftId].initialOwner == msg.sender,
            "only the initial owner of the nft can call this functions"
        );
        require(
            !_assets[_collectionAddress][_nftId].cashedOut,
            "already cashed out"
        );
        require(
            _assets[_collectionAddress][_nftId].totalBought >=
                _assets[_collectionAddress][_nftId].assetPrice,
            "withdrawal only available when asset price == shares bought"
        );
        (bool success, ) = msg.sender.call{
            value: _assets[_collectionAddress][_nftId].totalBought
        }("");
        require(success, "error cashing out");
    }

    /*
     * VIEW
     */

    /// @notice how much of this nft has been bought up
    /// @param _nftId that owner wants to change
    /// @param _collectionAddress the collection address
    function getRemainingPosition(
        address _collectionAddress,
        uint _nftId
    ) public view returns (uint remaining) {
        uint assetPrice = _assets[_collectionAddress][_nftId].assetPrice;
        uint totalBought = _assets[_collectionAddress][_nftId].totalBought;
        remaining = assetPrice - totalBought;
    }

    /// @notice how much of this nft has been bought up
    /// @param _nftId that owner wants to change
    /// @param _collectionAddress the collection address
    /// @param _ownerAddress whom you'd want to see his percentage
    /// @return percentage view a user's ownership percentage of the nft
    function getOwnershipPercentage(
        address _collectionAddress,
        uint _nftId,
        address _ownerAddress
    ) public view returns (uint percentage) {
        percentage = _assets[_collectionAddress][_nftId].ownershipPercentage[
            _ownerAddress
        ];
    }

    // Function to receive Ether. msg.data must be empty
    receive() external payable {}

    // Fallback function is called when msg.data is not empty
    fallback() external payable {}
}
