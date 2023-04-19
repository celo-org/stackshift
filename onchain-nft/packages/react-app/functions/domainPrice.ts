import { ethers } from "ethers";

export default function domainPrice(username: string) {
  if (username.length === 3) {
    return ethers.utils.parseEther("5");
  } else if (username.length === 4) {
    return ethers.utils.parseEther("3");
  }
  return ethers.utils.parseEther("1");
}
