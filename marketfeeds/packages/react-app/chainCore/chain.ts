import { WrapperBuilder } from "@redstone-finance/evm-connector";
import { ethers, utils } from "ethers";
import alfajoresAddresses from "../../hardhat/src/config/alfajores-addresses.json";
import localAddresses from "../../hardhat/src/config/local-addresses.json";
import nftAbi from "../nftabi.json";
import marketplaceAbi from "../marketabi.json";

const ALFA_NETWORK_ID = 44787;
const LOCAL_NETWORK_ID = 1337;

declare global {
  interface Window {
    ethereum: any;
  }
}

interface OrdersFromContract {
  tokenId: { toNumber: () => number };
  price: number;
  creator: string;
  status: number;
}

const ABIs = {
  nft: nftAbi,
  marketplace: marketplaceAbi,
};

async function getOwnedNfts(address: string) {
  const nft = await getContractInstance("nft");
  const nftCount = await nft.balanceOf(address);
  const tokenIds = [];
  for (let i = 0; i < nftCount; i++) {
    const tokenId = await nft.tokenOfOwnerByIndex(address, i);
    tokenIds.push(tokenId);
  }
  return tokenIds;
}

async function mintNft() {
  const nft = await getContractInstance("nft");
  const tx = await nft.mint();
  await tx.wait();
  return tx;
}

async function getAllOrders() {
  const marketplace = await getContractInstance("marketplace");
  const orders = await marketplace.getAllOrders();
  return orders
    .map((order: OrdersFromContract, index: number) => ({
      orderId: index,
      tokenId: order.tokenId.toNumber(),
      usdPrice: utils.formatEther(order.price),
      creator: order.creator,
      status: order.status,
    }))
    .filter((order: OrdersFromContract) => order.status === 0);
}

async function postOrder({
  tokenId,
  usdPrice,
}: {
  tokenId: string;
  usdPrice: number;
}) {
  const marketplace = await getContractInstance("marketplace");
  const nftContract = await getContractInstance("nft");

  // Sending approve tx
  const approveTx = await nftContract.approve(marketplace.address, tokenId);
  await approveTx.wait();

  // Posting order tx
  const postOrderTx = await marketplace.postSellOrder(
    nftContract.address,
    tokenId,
    utils.parseEther(String(usdPrice))
  );
  await postOrderTx.wait();
}

async function cancelOrder(orderId: string) {
  const marketplace = await getContractInstance("marketplace");
  const cancelTx = await marketplace.cancelOrder(orderId);
  await cancelTx.wait();
  return cancelTx;
}

async function buy(orderId: string) {
  const marketplace = await getContractInstance("marketplace");

  // Wrapping marketplace contract instance.
  // It enables fetching data from redstone data pool
  // for each contract function call
  const wrappedMarketplaceContract = WrapperBuilder.wrap(
    marketplace
  ).usingDataService(
    {
      dataServiceId: "redstone-main-demo",
      uniqueSignersCount: 1,
      dataFeeds: ["AVAX", "CELO"],
    },
    ["https://d33trozg86ya9x.cloudfront.net"]
  );

  // Checking expected amount
  const expectedAvaxAmount = await wrappedMarketplaceContract.getPrice(orderId);

  // Sending buy tx
  const buyTx = await wrappedMarketplaceContract.buy(orderId, {
    value: expectedAvaxAmount.mul(101).div(100), // a buffer for price movements
  });
  await buyTx.wait();

  return buyTx;
}

///////// STANDARD BLOCKCHAIN UTILS FUNCTIONS /////////

function shortenAddress(address: string) {
  return address.slice(0, 7) + ".." + address.slice(address.length - 7);
}

function onAddressChange(callback: () => void) {
  window.ethereum.on("accountsChanged", callback);
}

async function getUserAddress() {
  const signer = await getSigner();
  return await signer.getAddress();
}

async function connectWallet() {
  getChainId();
  await window.ethereum.request({ method: "eth_requestAccounts" });
}

async function getSigner() {
  await connectWallet();
  const signer = new ethers.providers.Web3Provider(window.ethereum).getSigner();
  return signer;
}

async function getContractInstance(contractName: "nft" | "marketplace") {
  const abi = ABIs[contractName];
  const address = await getContractAddress(contractName);
  const signer = await getSigner();
  return new ethers.Contract(address, abi, signer);
}

async function getContractAddress(contractName: "nft" | "marketplace") {
  const chainId = await getChainId();
  return chainId == LOCAL_NETWORK_ID
    ? localAddresses[contractName]
    : alfajoresAddresses[contractName];
}

async function getChainId() {
  const provider = new ethers.providers.Web3Provider(window.ethereum);
  const network = await provider.getNetwork();

  const chainId = network.chainId;

  // Check if network is supported
  if (![LOCAL_NETWORK_ID, ALFA_NETWORK_ID].includes(chainId)) {
    const errText = `Please connect to local network or to Avalanche FUJI testnet and reload the page`;
    alert(errText);
    throw new Error(errText);
  }

  return chainId;
}

export default {
  getOwnedNfts,
  mintNft,
  getAllOrders,
  postOrder,
  cancelOrder,
  buy,
  connectWallet,
  getUserAddress,
  shortenAddress,
  onAddressChange,
};
