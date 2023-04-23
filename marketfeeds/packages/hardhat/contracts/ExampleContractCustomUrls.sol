// SPDX-License-Identifier: MIT
pragma solidity ^0.8.2;

import "redstone-evm-connector/lib/contracts/message-based/PriceAware.sol";

contract ExampleContractCustomUrls is PriceAware {

  uint256 private lastValue = 0;

  function isSignerAuthorized(address _receviedSigner) public override virtual view returns (bool) {
    // For redstone-custom-urls-demo price feed (it has 2 authorised signers)
    return _receviedSigner == 0x11fFFc9970c41B9bFB9Aa35Be838d39bce918CfF
      || _receviedSigner == 0xdBcC2C6c892C8d3e3Fe4D325fEc810B7376A5Ed6;
  }

  function getValue() public view returns(uint256) {
    // Check more details at: https://custom-urls-manifest-updater.redstone.finance/0xc59fdf6be8a2f340

    uint256 valueFromUrl = getPriceFromMsg(bytes32("0xc59fdf6be8a2f340"));
    return valueFromUrl;
  }
}
