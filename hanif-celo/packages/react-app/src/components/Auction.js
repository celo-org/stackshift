import React, { useState, useEffect } from "react";
import { Container, Row, Col, Card, Button } from "react-bootstrap";
import Web3 from "web3";
import AuctionContract from "../artifacts/Auction.json";

const Auction = () => {
  const [web3, setWeb3] = useState(null);
  const [contract, setContract] = useState(null);
  const [accounts, setAccounts] = useState([]);
  const [items, setItems] = useState([]);

  useEffect(() => {
    const init = async () => {
      const _web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
      const _accounts = await _web3.eth.getAccounts();
      const networkId = await _web3.eth.net.getId();
      const deployedNetwork = AuctionContract.networks[networkId];
      const _contract = new _web3.eth.Contract(
        AuctionContract.abi,
        deployedNetwork && deployedNetwork.address
      );

      setWeb3(_web3);
      setContract(_contract);
      setAccounts(_accounts);
      const itemsCount = await _contract.methods.getItemsCount().call();
      const _items = [];

      for (let i = 0; i < itemsCount; i++) {
        const item = await _contract.methods.items(i).call();
        _items.push(item);
      }

      setItems(_items);
    };

    init();
  }, []);

  const handleBid = async (itemId, amount) => {
    const weiAmount = web3.utils.toWei(amount, "ether");
    await contract.methods.bid(itemId).send({ from: accounts[0], value: weiAmount });
  };

  const handleWithdrawBid = async (itemId) => {
    await contract.methods.withdrawBid(itemId).send({ from: accounts[0] });
  };

  return (
    <Container>
      <Row>
        {items.map((item, index) => (
          <Col md={4} key={index}>
            <Card style={{ width: "18rem" }}>
              <Card.Img variant="top" src={item.image} />
              <Card.Body>
                <Card.Title>{item.name}</Card.Title>
                <Card.Text>
                  Starting Price: {web3.utils.fromWei(item.startingPrice.toString(), "ether")} CELO
                  <br />
                  Bidding Period: {item.biddingPeriod} seconds
                  <br />
                  Reserve Price: {web3.utils.fromWei(item.reservePrice.toString(), "ether")} CELO
                  <br />
                  Highest Bid: {web3.utils.fromWei(item.highestBid.toString(), "ether")} CELO
                  <br />
                  Highest Bidder: {item.highestBidder}
                </Card.Text>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <input type="text" placeholder="Bid amount (CELO)" id={`bid-amount-${index}`} />
                            <Button variant="primary" onClick={() => handleBid(index, document.getElementById(bid - amount - ${ index }).value)}>
                            </Button>
</div>
<div style={{ display: "flex", justifyContent: "center", marginTop: "10px" }}>
<Button variant="danger" onClick={() => handleWithdrawBid(index)}>
Withdraw Bid
</Button>
</div>
</Card.Body>
</Card>
</Col>
))}
</Row> 
</Container>
);
};

export default Auction;