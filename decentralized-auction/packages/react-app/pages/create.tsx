import { CustomButton } from "@/components/CustomConnectBtn/CustomConnectBtn";
import FileHandler from "@/components/FileHandler/FileHandler";
import { Input, InputTextArea } from "@/components/Input/Input";
import { Box, Grid } from "@mui/material";
import React from "react";

export default function Create() {
  return (
    <Box
      sx={{
        maxWidth: "95% !important",
        height: "100%",
        overflowY: "hidden",
      }}
      m={"auto"}
      flex={1}
    >
      <Box py={"1.5em"} position={"sticky"} top={0}>
        <h1
          style={{
            fontWeight: 400,
          }}
        >
          Create an Auction
        </h1>
      </Box>
      <Box
        sx={{
          height: "90%",
        }}
      >
        <Grid
          container
          spacing={5}
          sx={{
            height: "100%",
          }}
        >
          <Grid
            item
            md={6}
            sx={{
              overflowY: "scroll",
              height: "max-content",
            }}
          >
            <Box>
              <FileHandler />
            </Box>
          </Grid>
          <Grid
            item
            md={6}
            sx={{
              overflowY: "auto",
              maxHeight: "100%",
            }}
          >
            <Box
              sx={{
                overflowY: "scroll",
                height: "100% !important",
                paddingRight: "1em",
              }}
            >
              <Box>
                <Input mtOff label="Title" />
              </Box>
              <Box>
                <Input mtOff type="number" label="Reserve Price" />
              </Box>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Input mtOff type="datetime-local" label="Start Time" />
                </Grid>
                <Grid item md={6}>
                  <Input mtOff type="datetime-local" label="End Time" />
                </Grid>
              </Grid>
              <Box>
                <InputTextArea mtOff label="Description" />
              </Box>
              <CustomButton
                size="large"
                fullWidth
                sx={{
                  mb: "1.5em",
                }}
              >
                Create Auction
              </CustomButton>
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
}
