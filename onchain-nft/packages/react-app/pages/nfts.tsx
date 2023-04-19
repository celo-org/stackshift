import NFTPreview from "@/components/NFTPreview";
import styled from "@emotion/styled";
import React, { useEffect, useState } from "react";
import { useAccount } from "wagmi";

const Container = styled.div`
  width: 85%;
  margin: auto;

  h1 {
    margin: 1em 0;
  }
`;

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
`;

export default function Nfts() {
  const { address } = useAccount();
  const [nfts, setNfts] = useState<
    {
      name: string;
      image: string;
    }[]
  >([]);
  const [fetchingNftBalances, setFetchingNftBalances] = useState(true);

  useEffect(() => {
    async function fetchNFTs() {
      try {
        const nftMetadata = await fetch(
          `/api/token_balances?address=${address}`
        );
        const nfts = await nftMetadata.json();
        setNfts(nfts);
        setFetchingNftBalances(false);
      } catch (error) {
        setFetchingNftBalances(false);
      }
    }

    if (address) fetchNFTs();
  }, [address]);

  return (
    <Container>
      <h1>My NFT Domains</h1>

      {!fetchingNftBalances ? (
        <Grid>
          {nfts.length ? (
            nfts.map((nft) => <NFTPreview img={nft.image} key={nft.name} />)
          ) : (
            <p>You don&lsquo;t have any NFT domains yet.</p>
          )}
        </Grid>
      ) : (
        <p>Fetching NFT Balances...</p>
      )}
    </Container>
  );
}
