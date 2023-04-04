import { providers, Contract, ethers } from "ethers";

import contractABI from "./Auction.json"
const contractAddress = "0xA8fdd2931eEd20D8C0B255324f58c13E55D8b19a";

export async function getContract() {
    let contract;
    try {
        const { ethereum } = window;
        //console.log("ChainId: ", ethereum.chainId);

        if (ethereum.chainId === "0xaef3") {
            const provider = new providers.Web3Provider(ethereum);
            //console.log("provider", provider);
            const signer = provider.getSigner();
            contract = new Contract(contractAddress, contractABI.abi, signer);
        } else {
            throw new Error("Please connect to the Alfajores network");
        }
    } catch (error) {
        console.log("ERROR: ", error);
    }
    
    return contract;
}

export async function getAuction() {
    try {
        const contract = await getContract();
        return await contract.getAuction();
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

export async function bid(amount) {
    try {
        const contract = await getContract();
        const tx = await contract.bid({
            value: ethers.utils.parseEther(amount), 
        });

        console.log("bid tx: ", tx);
        return tx;
    } catch (error) {
        console.log("ERROR: ", error);
    }
}

export async function setEndtime(duration) {
    try {
        const contract = await getContract();
        const tx = await contract.setEndtime(duration);

        return tx;
    } catch (error) {
        console.log("ERROR: ", error);
    }    
}
