import { useAccount, useProvider, useSigner } from "wagmi";
import { parseEther } from "ethers/lib/utils.js";
import ToucanClient, { UserRetirementsResponse } from "toucan-sdk";
import { useEffect, useState } from "react";
import { Box, Button, Divider, Grid, Typography } from "@mui/material";

export default function Home() {
  const { address, isConnected } = useAccount();
  const [userAuth, setUserAuth] = useState(false);
  const provider = useProvider();
  const { data: signer, isError, isLoading } = useSigner();
  const toucan = new ToucanClient("alfajores", provider);
  signer && toucan.setSigner(signer);

  const [tco2Address, setTco2Address] = useState("");
  const [retirements, setRetirements] = useState<UserRetirementsResponse[]>([]);

  const getUserRetirements = async () => {
    let currentAddress = address?.toLocaleLowerCase() as string;
    const redemptions = await toucan.fetchUserRetirements(currentAddress);

    redemptions && setRetirements(redemptions);
    console.log(redemptions);
  };

  useEffect(() => {
    if (isConnected) {
      setUserAuth(true);
      getUserRetirements();
    }
  }, [isConnected]);

  const redeemPoolToken = async (): Promise<string> => {
    if (tco2Address.length) {
      return tco2Address;
    }
    const redeemedTokenAddress = await toucan.redeemAuto2(
      "NCT",
      parseEther("1")
    );
    redeemedTokenAddress && setTco2Address(redeemedTokenAddress[0].address);
    return redeemedTokenAddress[0].address;
  };

  const retireTco2Token = async (_tco2Address: string): Promise<void> => {
    let currentAddress = address?.toLocaleLowerCase() as string;

    _tco2Address.length &&
      (await toucan.retireAndMintCertificate(
        currentAddress,
        currentAddress,
        currentAddress,
        "Just helping the planet",
        parseEther("1"),
        _tco2Address
      ));
  };

  async function retireTokens() {
    try {
      let _tco2Address = await redeemPoolToken();
      await retireTco2Token(_tco2Address);
      await getUserRetirements();
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <div>
      <Box>
        <Box
          sx={{
            maxWidth: "1320px",
            mx: "auto",
            py: 3,
          }}
        >
          <Box mb={4}>
            <Typography variant="h4">Helping the planet</Typography>
            <Typography variant="h6" mt={2}>
              We are helping the planet by planting trees and offsetting carbon
              emissions. For every token you redeem, we will plant a tree on
              your behalf. You can also redeem your tokens for carbon credits.
              <br />
              <br />
              <b>How it works:</b> <br />
              1.{" "}
              <a
                href="https://faucet.toucan.earth/"
                target="_blank"
                rel="noreferrer"
                style={{
                  color: "#2b2b2b",
                }}
              >
                Get some tokens
              </a>{" "}
              from the faucet <br />
              2. Redeem your token for a tree or carbon credit <br />
              3. We will plant a tree or offset carbon emissions on your behalf
              <br />
            </Typography>
            <Button
              sx={{
                mt: 2,
                backgroundColor: "#2b2b2b",
                color: "#fff",
                fontSize: "16px",
                px: 4,
                py: 1,

                "&:hover": {
                  backgroundColor: "#2b2b2b50",
                },
                "&.Mui-disabled": {
                  color: "#fff",
                  backgroundColor: "#2b2b2b",
                  opacity: 0.5,
                  cursor: "not-allowed",
                },
              }}
              onClick={retireTokens}
              disabled={!userAuth}
            >
              Redeem and retire tokens
            </Button>
          </Box>
          <Typography variant="h5" mb={3}>
            Your Retired Tokens
          </Typography>
          <Grid container spacing={2}>
            {retirements.map((retirement, index) => (
              <Grid item xs={3} sm={3} md={3} key={index}>
                <Card
                  certificateId={retirement.certificate?.id}
                  tokenName={retirement.token.name}
                  certificateCreatedAt={
                    retirement.certificate?.createdAt ?? retirement.timestamp
                  }
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Box>
    </div>
  );
}

const Card = ({
  certificateId,
  certificateCreatedAt,
  tokenName,
}: {
  certificateId: string;
  certificateCreatedAt: string;
  tokenName: string;
}) => {
  return (
    <Box
      sx={{
        boxShadow: "rgba(0, 0, 0, 0.16) 0px 1px 4px",
        borderRadius: "9px",
        p: 4,
      }}
    >
      {certificateId && certificateCreatedAt ? (
        <>
          <Typography variant="h4">{certificateId}</Typography>
          <Typography variant="body1" mt={2}>
            {new Date(parseInt(certificateCreatedAt) * 1000).toDateString()}
          </Typography>
        </>
      ) : (
        <>
          <Typography variant="body1" mt={2}>
            Token not retired yet.
          </Typography>
          <Typography variant="body1" mt={2}>
            Redeemed at{" "}
            {new Date(parseInt(certificateCreatedAt) * 1000).toDateString()}
          </Typography>
        </>
      )}
      <Divider
        sx={{
          my: 2,
          width: "50px",
          height: "2px",
          backgroundColor: "#2b2b2b",
          borderBottom: "none",
          borderRadius: "20px",
        }}
      />
      <Typography variant="h5">{tokenName}</Typography>
    </Box>
  );
};
