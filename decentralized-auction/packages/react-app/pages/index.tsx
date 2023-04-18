import AuctionCard from "@/components/AuctionCard/AuctionCard";
import { Box, Grid } from "@mui/material";
import abi from "@/utils/contract.json";
import { useContractRead } from "wagmi";
import { useEffect, useState } from "react";
import AuctionDialog from "@/components/AuctionDialog/AuctionDialog";
import { AuctionTypes, ContractResponseType } from "@/types";

export default function Home() {
  const [openAuctionDialog, setOpenAuctionDialog] = useState(false);
  const [activeAuction, setActiveAuction] = useState<AuctionTypes>();

  const { data: auctions, refetch } = useContractRead({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getAllAuctions",
  });

  const [aggregatedAuctions, setAggregatedAuctions] = useState<AuctionTypes[]>(
    []
  );

  const triggerBidModal = (id: number) => {
    setOpenAuctionDialog(true);
    let auction = aggregatedAuctions.find((auction) => auction.id === id);
    setActiveAuction(auction);
  };

  const closeBidModal = () => {
    setOpenAuctionDialog(false);
  };

  useEffect(() => {
    let aggregatedAuctions = (auctions as ContractResponseType[])?.map(
      async (auction) => {
        let ipfsHash = auction.ipfsHash.slice(7);
        let metadata = await fetch(
          `https://gateway.pinata.cloud/ipfs/${ipfsHash}`
        );
        let metadataJson = await metadata.json();

        return {
          ...metadataJson,
          ended: auction.ended,
          id: Number(auction.id),
          seller: auction.seller,
          endTime: Number(auction.endTime),
          itemReceived: auction.itemReceived,
          startTime: Number(auction.startTime),
          highestBidder: auction.highestBidder,
          highestBid: Number(auction.highestBid),
          reservePrice: Number(auction.reservePrice),
        };
      }
    );

    if (aggregatedAuctions) {
      let aggregatedAuctionsPromise = Promise.all(aggregatedAuctions);
      aggregatedAuctionsPromise.then((aggregatedAuctions) => {
        setAggregatedAuctions(aggregatedAuctions);
      });
    }
  }, [auctions]);

  return (
    <>
      <Box width={"100%"} my={2}>
        <Box width={"95%"} m={"auto"} py={4} pb={6}>
          <Grid container rowSpacing={3} columnSpacing={5}>
            {aggregatedAuctions?.map((auction) => (
              <Grid item xs={12} sm={6} md={4} key={auction.id}>
                <AuctionCard
                  ended={auction.ended}
                  preview={`https://gateway.pinata.cloud/ipfs/${auction.preview.slice(
                    7
                  )}`}
                  title={auction.title}
                  endtime={auction.endTime.toString()}
                  highestBid={auction.highestBid}
                  triggerBidModal={() => triggerBidModal(auction.id)}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
      {openAuctionDialog && activeAuction && (
        <AuctionDialog
          open={openAuctionDialog}
          auctionData={activeAuction}
          closeBidModal={closeBidModal}
          updateAuctions={refetch}
        />
      )}
    </>
  );
}
