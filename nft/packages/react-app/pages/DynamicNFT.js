import React, { useEffect, useState, useCallback } from "react";
import { useCelo } from "@celo/react-celo";
import { ethers } from "ethers";
import contractAbi from "../NFT.json";
import { Button, Card, Container, Nav, Navbar } from "react-bootstrap";

import "bootstrap/dist/css/bootstrap.min.css";

const contractAddress = "0x654B63E70E84Baa8fbeD965127B4f04BB634c993";

export const DynamicNFT = () => {
  const { kit, address, connect, disconnect } = useCelo();

  const [walletAddress, setWalletAddress] = React.useState(null);

  const connectToWallet = async () => {
    try {
      await window.ethereum.enable();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });
      setWalletAddress(accounts[0]);
      console.log("Wallet connected:", walletAddress);
    } catch (error) {
      console.error(error);
    }
  };

  const mintNFT = async () => {
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        contractAbi.abi,
        signer
      );

      // Replace with Your metadata
      const metadata =
        "https://ipfs.io/ipfs/QmVDz6EJ7U4WC2iNXbAS5yGmTQwyqYumi39aKuiXCLbEmV/0.json";

      const result = await contract.safeMint(metadata, { from: walletAddress });
      console.log(result);
    } catch (error) {
      console.error(error);
    }
  };

  const disconnectFromWallet = async () => {
    try {
      await window.ethereum.request({
        method: "eth_requestAccounts",
        accounts: [],
      });
      setWalletAddress(null);
      console.log("Wallet disconnected");
    } catch (error) {
      console.error(error);
    }
  };

  React.useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.ethereum.isConnected()) {
        const accounts = await window.ethereum.request({
          method: "eth_requestAccounts",
        });
        setWalletAddress(accounts[0]);
        console.log("Wallet connected:", walletAddress);
      } else {
        console.log("Wallet not connected");
      }
    };
    checkWalletConnection();
  }, []);

  // async function listTokensOfOwner() {
  //   const provider = new ethers.providers.Web3Provider(window.ethereum);

  //   const contract = new ethers.Contract(
  //     contractAddress,
  //     contractAbi.abi,
  //     provider
  //   );

  //   const sentLogs = await contract.queryFilter(
  //     contract.filters.Transfer(walletAddress, null)
  //   );
  //   const receivedLogs = await contract.queryFilter(
  //     contract.filters.Transfer(null, walletAddress)
  //   );

  //   const logs = sentLogs
  //     .concat(receivedLogs)
  //     .sort(
  //       (a, b) =>
  //         a.blockNumber - b.blockNumber ||
  //         a.transactionIndex - b.TransactionIndex
  //     );

  //   const owned = new Set();

  //   for (const log of logs) {
  //     const { from, to, tokenId } = log.args;

  //     if (addressEqual(to, walletAddress)) {
  //       owned.add(tokenId.toString());
  //     } else if (addressEqual(from, walletAddress)) {
  //       owned.delete(tokenId.toString());
  //     }
  //   }

  //   const uri = [];
  //   for (const own of owned) {
  //     const tokenuri = await tokenUri(own);
  //     const response = await axios.get(tokenuri);

  //     uri.push(response.data);
  //   }
  //   setuserNFT(uri);
  // }
  // console.log(userNFt);

  // React.useEffect(() => {
  //   checkWalletConnection();
  // }, []);

  return (
    <div style={{ backgroundColor: "white" }}>
      <Navbar bg="light" expand="lg">
        <Navbar.Brand href="/">NFT Minter</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ml-auto">
            {!walletAddress ? (
              <Nav.Link href="#" onClick={connectToWallet}>
                Connect
              </Nav.Link>
            ) : (
              <Nav.Link href="#" onClick={disconnectFromWallet}>
                Disconnect
              </Nav.Link>
            )}
            <Nav.Link href="NFTs">View NFTs</Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      <Container>
        <Card style={{ width: "18rem" }} className="mx-auto mt-5">
          <Card.Img
            variant="top"
            src={`https://ipfs.io/ipfs/QmYm5tRXZ3Bk8r6Z7eQhq1wiVNMB1BBt1o2Doby2yKoqrS/0.jpg`}
          />
          <Card.Body>
            {walletAddress && (
              <>
                <Button variant="primary" onClick={mintNFT}>
                  Mint NFT
                </Button>
              </>
            )}
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};
