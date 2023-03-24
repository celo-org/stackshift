// SPDX-License-Identifier:MIT

pragma solidity ^0.8.15;

contract SplitPayment {
    address payable [] public recipients;
    event TransferReceived(address _from, uint256 _amount);
    address payable owner;
    bool internal locked;

    modifier onlyOwner{
        require(msg.sender == owner, 'You are not the owner');
        _;
    }

    modifier noReentrant() {
        require(!locked, "No re-entrancy");
        locked = true;
        _;
        locked = false;
    }

    constructor(){
        owner = payable(msg.sender);
    }

    function addReceipients(address payable _address) public onlyOwner {
        recipients.push(_address);
    }

    function getReceipients() public view returns(address payable[] memory _address){
        return recipients;
    }

    function clearRecipients() public onlyOwner{
        require(recipients.length != 0, "There are no receipients");
        delete recipients;
    }
    
    receive() external payable {}

    function fundContract() public payable noReentrant{
        // Call returns a boolean value indicating success or failure.
        // This is the current recommended method to use.
        (bool sent,) = address(this).call{value: msg.value}("");
        require(sent, "Failed to send Ether");
    }

    function split() public payable onlyOwner noReentrant{
        require(recipients.length != 0, "There are no receipients");
        require(address(this).balance > 0, "No fund in the account");
        uint256 share = msg.value /recipients.length;
        for(uint256 i=0; i<recipients.length; i++){
            recipients[i].transfer(share);
        }
        emit TransferReceived(msg.sender, msg.value);
    }

    function contractBalance() public view returns(uint256){
        return address(this).balance;
    }
}