import { ethers } from "ethers";
import type { NextApiRequest, NextApiResponse } from "next";

const contractAddress = process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as string;

const abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function tokenOfOwnerByIndex(address owner, uint256 index) view returns (uint256)",
  "function tokenURI(uint256 tokenId) view returns (string)",
];

const provider = new ethers.providers.JsonRpcProvider(
  process.env.NEXT_PUBLIC_INFURA_PROVIDER_URL as string
);
const contract = new ethers.Contract(contractAddress, abi, provider);

async function getTokenURIs(address: string): Promise<string[]> {
  const numTokens = await contract.balanceOf(address);

  const promises = [];
  for (let i = 0; i < numTokens; i++) {
    const tokenId = await contract.tokenOfOwnerByIndex(address, i);
    promises.push(contract.tokenURI(tokenId));
  }

  const tokenURIs = await Promise.all(promises);
  return tokenURIs;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const address = req.query.address;
  let tokenURIs = await getTokenURIs(address as string);

  // Map tokenURIs to token metadata from base64 encoded JSON
  tokenURIs = tokenURIs.map((tokenURI) => {
    const base64 = tokenURI.split(",")[1];
    const json = Buffer.from(base64, "base64").toString();
    return JSON.parse(json);
  });

  // Return the token metadata
  res.status(200).json(tokenURIs);
}
