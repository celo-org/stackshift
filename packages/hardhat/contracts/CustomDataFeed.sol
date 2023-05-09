import "@redstone-finance/evm-connector/contracts/data-services/MainDemoConsumerBase.sol";

contract CustomDataFeed is MainDemoConsumerBase {
  // Getting a single value
uint256 ethPrice = getOracleNumericValueFromTxMsg(bytes32("ETH"));

// Getting several values
bytes32[] memory dataFeedIds = new bytes32[](2);
dataFeedIds[0] = bytes32("ETH");
dataFeedIds[1] = bytes32("BTC");
uint256[] memory values = getOracleNumericValuesFromTxMsg(dataFeedIds);
uint256 ethPrice = values[0];
uint256 btcPrice = values[1];
}