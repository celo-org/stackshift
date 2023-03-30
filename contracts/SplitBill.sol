// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0 <0.8.0;



contract SplitBill {




  function split(uint n, address[] memory friends) public payable {
    //console.log(msg.sender, friends.length);
    uint l = friends.length;
    uint amount = n/l;
    //console.log(amount);
    for (uint i = 0; i < l; i++) {
      address recepient = friends[i];
      (bool sent, bytes memory data) = recepient.call{value:amount}("");
      require(sent, "Failed to send Ether");
      //console.log("transferred ", amount, " to " , recepient);         
    }
  }



  // to support receiving ETH by default
  receive() external payable {}
  //fallback() external payable {}
}