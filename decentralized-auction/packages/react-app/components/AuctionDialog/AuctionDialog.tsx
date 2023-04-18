import * as React from "react";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { ThemeProvider, createTheme } from "@mui/material";
import { Input } from "../Input/Input";
import { CustomButton } from "../CustomConnectBtn/CustomConnectBtn";
import styled from "@emotion/styled";
import { useAccount, useContractWrite } from "wagmi";
import abi from "@/utils/contract.json";
import { ethers } from "ethers";
import Loader from "../Loader";
import { AuctionTypes } from "@/types";
import { notify } from "@/functions";

const theme = createTheme({
  typography: {
    fontFamily: `"Work Sans", sans-serif`,
  },
});

const BidPreview = styled.img`
  width: 50%;
  height: 100%;
  object-fit: cover;
  object-position: center;
  border-radius: 10px;
  box-shadow: rgba(0, 0, 0, 0.02) 0px 1px 3px 0px,
    rgba(27, 31, 35, 0.15) 0px 0px 0px 1px;
`;

function shortenAddress(address: string, startLength = 6, endLength = 6) {
  if (!address) return "";
  return `${address.slice(0, startLength)}...${address.slice(-endLength)}`;
}

export default function AuctionDialog({
  open,
  auctionData,
  closeBidModal,
  updateAuctions,
}: {
  open: boolean;
  auctionData: AuctionTypes;
  closeBidModal: () => void;
  updateAuctions: () => void;
}) {
  const { address, isConnected } = useAccount();
  const [bidding, setBidding] = React.useState(false);
  const [finalizingBid, setFinalizingBid] = React.useState(false);
  const [endingAuction, setEndingAuction] = React.useState(false);
  const [bidAmount, setBidAmount] = React.useState(0);
  const { writeAsync } = useContractWrite({
    abi,
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "placeBid",
    args: [auctionData.id],
    overrides: {
      value: ethers.utils.parseEther(bidAmount.toString()),
    },
  });
  const { writeAsync: finalizeBid } = useContractWrite({
    abi,
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "confirmItemReceived",
    args: [auctionData.id],
  });
  const { writeAsync: endAuction } = useContractWrite({
    abi,
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "endAuction",
    args: [auctionData.id],
  });

  const handleClose = () => {
    closeBidModal();
  };

  const bidAmountChangeHandler = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      setBidAmount(parseFloat(e.target.value));
    } else {
      setBidAmount(0);
    }
  };

  const bidHandler = async () => {
    setBidding(true);
    try {
      (await writeAsync())
        .wait()
        .then(() => {
          closeBidModal();
          updateAuctions();
          setBidAmount(0);
          notify("success", "Bid placed successfully");
          setBidding(false);
        })
        .catch((error) => {
          notify("error", "Could not place bid");
          setBidding(false);
        });
    } catch (error) {
      notify("error", "Could not place bid");
      setBidding(false);
    }
  };

  const finalizeBidHandler = async () => {
    setFinalizingBid(true);
    try {
      (await finalizeBid())
        .wait()
        .then(() => {
          closeBidModal();
          updateAuctions();
          notify("success", "Item claimed successfully");
          setFinalizingBid(false);
        })
        .catch((error) => {
          notify("error", "Could not claim item");
          setFinalizingBid(false);
        });
    } catch (error) {
      notify("error", "Could not claim item");
      setFinalizingBid(false);
    }
  };

  const endAuctionHandler = async () => {
    setEndingAuction(true);
    try {
      (await endAuction())
        .wait()
        .then(() => {
          closeBidModal();
          updateAuctions();
          notify("success", "Auction Ended successfully");
          setEndingAuction(false);
        })
        .catch((error) => {
          notify("error", "Could not end auction");
          setEndingAuction(false);
        });
    } catch (error) {
      notify("error", "Could not end auction");
      setEndingAuction(false);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <Dialog
        fullWidth={true}
        maxWidth={"md"}
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>{auctionData.title}</DialogTitle>
        <DialogContent>
          <Box
            width={"100%"}
            boxSizing={"border-box"}
            mb={"2em"}
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"space-between"}
            gap={"1em"}
          >
            <BidPreview
              src={`https://gateway.pinata.cloud/ipfs/${auctionData.preview.slice(
                7
              )}`}
              alt={auctionData.title}
            />
            <Box
              width={"50%"}
              display={"flex"}
              flexDirection={"column"}
              gap={"1.5em"}
            >
              <Box display={"flex"}>
                <Box flex={1}>
                  <h4>Start Date</h4>
                  <span>
                    {new Date(auctionData.startTime! * 1000).toLocaleString()}
                  </span>
                </Box>
                <Box flex={1}>
                  <h4>End Date</h4>
                  <span>
                    {new Date(auctionData.endTime! * 1000).toLocaleString()}
                  </span>
                </Box>
              </Box>
              <Box display={"flex"}>
                <Box flex={1}>
                  <h4>Creator</h4>
                  <span>{shortenAddress(auctionData.seller!)}</span>
                </Box>
                <Box flex={1}>
                  <h4>Reserve Price</h4>
                  <span>
                    {parseFloat(
                      (auctionData.reservePrice! / 10 ** 18).toString()
                    ).toFixed(2)}
                  </span>
                </Box>
              </Box>
              <Box display={"flex"}>
                <Box flex={1}>
                  <h4>Highest Bidder</h4>
                  <span>{shortenAddress(auctionData.highestBidder!)}</span>
                </Box>
                <Box flex={1}>
                  <h4>Highest Bid</h4>
                  <span>
                    {parseFloat(
                      (auctionData.highestBid / 10 ** 18).toString()
                    ).toFixed(2)}
                  </span>
                </Box>
              </Box>
              {address === auctionData.seller ||
              !isConnected ||
              address === auctionData.highestBidder ||
              parseInt(auctionData.endTime.toString()) <
                new Date().getTime() / 1000 ? (
                <></>
              ) : (
                <>
                  <Box display={"flex"} alignContent={"flex-end"} gap={"1em"}>
                    <Box flex={4}>
                      <Input
                        mtOff
                        type="n"
                        label="Bid"
                        value={bidAmount}
                        onChange={bidAmountChangeHandler}
                        disabled={bidding}
                      />
                    </Box>
                    <Box flex={2}>
                      <CustomButton
                        style={{
                          width: "100%",
                          marginTop: "2em",
                          height: "45px",
                        }}
                        onClick={bidHandler}
                        disabled={bidding}
                      >
                        {bidding ? <Loader /> : "Place Bid"}
                      </CustomButton>
                    </Box>
                  </Box>
                </>
              )}
              {parseInt(auctionData.endTime.toString()) <
                new Date().getTime() / 1000 &&
              auctionData.highestBidder === address ? (
                <Box display={"flex"}>
                  <Box flex={1}>
                    <h4>Auction Status</h4>
                    <span>
                      {auctionData.itemReceived ? "Completed" : "Processing"}
                    </span>
                  </Box>
                  <Box flex={1}>
                    {auctionData.highestBidder === address && (
                      <CustomButton
                        style={{
                          width: "100%",
                        }}
                        onClick={finalizeBidHandler}
                        disabled={auctionData.itemReceived || finalizingBid}
                      >
                        {finalizingBid ? <Loader /> : "Item Received"}
                      </CustomButton>
                    )}
                  </Box>
                </Box>
              ) : (
                <></>
              )}
              {parseInt(auctionData.endTime.toString()) <
                new Date().getTime() / 1000 &&
              auctionData.seller === address ? (
                <Box display={"flex"}>
                  <Box flex={1}>
                    <h4>Auction Status</h4>
                    <span>{auctionData.ended ? "Ended" : "Processing"}</span>
                  </Box>
                  <Box flex={1}>
                    {auctionData.seller === address && (
                      <CustomButton
                        style={{
                          width: "100%",
                        }}
                        bgcolor="#ff0000"
                        onClick={endAuctionHandler}
                        disabled={auctionData.ended || endingAuction}
                      >
                        {endingAuction ? <Loader /> : "End Auction"}
                      </CustomButton>
                    )}
                  </Box>
                </Box>
              ) : (
                <></>
              )}
            </Box>
          </Box>
          <DialogContentText
            letterSpacing={".005em"}
            textAlign={"justify"}
            lineHeight={"1.5em"}
          >
            {auctionData.description}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
