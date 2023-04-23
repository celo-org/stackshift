import stockABI from "./contractABI.json";
import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ethers } from "ethers";

const stockAddress = "0xBB740EDDB83312CEa22c2BE3D09e712A887632FA";

export function connectContracts(kit: any) {
  return new kit.connection.web3.eth.Contract(stockABI.abi, stockAddress);
}

export const getPrice = async (
  address: string | null | undefined,
  kit: any
) => {
  try {
    const wrappedContract = WrapperBuilder.wrap(
      connectContracts(kit)
    ).usingDataService(
      {
        dataServiceId: "redstone-custom-urls-demo",
        uniqueSignersCount: 2,
        dataFeeds: ["0xc0ede6807bd5d9da"],
      },
      ["https://d1zm8lxy9v2ddd.cloudfront.net"]
    );

    const res = await wrappedContract.getLatestTslaPrice();
    console.log(res);
  } catch (e: any) {
    console.log(e.message);
  }
};

export const getStockPrice = async (kit: any) => {
  try {
    const response = await connectContracts(kit)
      .methods.getLatestTslaPrice()
      .call();
    console.log(response);
    return response;
  } catch (e) {
    console.log(e);
  }
};
