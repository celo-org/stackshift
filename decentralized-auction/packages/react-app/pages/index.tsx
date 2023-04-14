import AuctionCard from "@/components/AuctionCard/AuctionCard";
import { Box, Grid } from "@mui/material";

export default function Home() {
  return (
    <Box width={"100%"} my={2}>
      <Box width={"95%"} m={"auto"} py={4} pb={6}>
        <Grid container rowSpacing={3} columnSpacing={5}>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <AuctionCard />
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
