// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";
import "./Marketplace.sol";

/* 
    StableMarketplace contract extends MainDemoConsumerBase contract
    For being able to use redstone oracles data, more inf:
    https://docs.redstone.finance/docs/smart-contract-devs/get-started/redstone-core#1-adjust-your-smart-contracts 
*/
contract StableMarketplace is Marketplace, MainDemoConsumerBase {
  // `_getPriceFromOrder` function uses the `getPriceFromMsg` function,
  // which fetches signed data from tx calldata and verifies its signature
  function _getPriceFromOrder(
    SellOrder memory order
  ) internal view override returns (uint256) {
    uint256 avaxPrice = getOracleNumericValueFromTxMsg(bytes32("AVAX"));
    return (order.price / avaxPrice) * (10 ** 8);
  }
}
