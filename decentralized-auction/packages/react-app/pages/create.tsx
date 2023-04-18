import { fromString } from "uint8arrays/from-string";
import { CustomButton } from "@/components/CustomConnectBtn/CustomConnectBtn";
import FileHandler from "@/components/FileHandler/FileHandler";
import { Input, InputTextArea } from "@/components/Input/Input";
import { Box, Grid } from "@mui/material";
import { useFormik } from "formik";
import React, { useEffect, useState } from "react";
import { create } from "ipfs-http-client";
import abi from "@/utils/contract.json";
import { useContractWrite } from "wagmi";
import { ethers } from "ethers";

const projectId = process.env.NEXT_PUBLIC_INFURA_PROJECT_ID;
const projectSecret = process.env.NEXT_PUBLIC_INFURA_PROJECT_SECRET;
const auth =
  "Basic " + Buffer.from(projectId + ":" + projectSecret).toString("base64");

/* create the client */
const ipfs = create({
  host: "ipfs.infura.io",
  port: 5001,
  protocol: "https",
  headers: {
    authorization: auth,
  },
});

function removeMimeTypeFromBase64(base64String: string) {
  const regex = /^data:\w+\/\w+;base64,/;
  return base64String.replace(regex, "");
}

export default function Create() {
  const [imageUrl, setImageUrl] = useState<string>("");
  const [metadataCid, setMetadataCid] = useState<string>("");
  const auctionForm = useFormik({
    initialValues: {
      title: "",
      reservePrice: 0,
      startTime: new Date().toISOString().slice(0, -8),
      endTime: "",
      description:
        "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Autem repellendus recusandae iste asperiores totam non modi, nihil illum enim quod exercitationem commodi, doloribus odit! Maiores dolorum ex in ea reiciendis labore totam ducimus asperiores nemo a quia blanditiis, expedita, voluptates sapiente natus temporibus, ipsa accusamus.",
    },

    onSubmit: async (values) => {
      let _reservePrice = values.reservePrice;
      let _startTime = (new Date(values.startTime).getTime() / 1000).toString();
      let _endTime = (new Date(values.endTime).getTime() / 1000).toString();

      const buffer = fromString(removeMimeTypeFromBase64(imageUrl), "base64");
      const added = await ipfs.add(buffer);
      let imageCid = added.cid.toString();

      let metadata = {
        title: values.title,
        preview: "ipfs://" + imageCid,
        description: values.description,
      };

      const metadataBuffer = fromString(JSON.stringify(metadata));
      const metadataAdded = await ipfs.add(metadataBuffer);
      let metadataCid = metadataAdded.cid.toString();

      let metadataUrl = "ipfs://" + metadataCid;
      setMetadataCid(metadataUrl);
    },
  });
  const { writeAsync: createAuction } = useContractWrite({
    abi,
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "createAuction",
    args: [
      metadataCid,
      // ethers.utils.parseUnits(
      //   auctionForm.values.reservePrice.toString(),
      //   "ether"
      // ),
      (new Date(auctionForm.values.startTime).getTime() / 1000).toString(),
      (new Date(auctionForm.values.endTime).getTime() / 1000).toString(),
    ],
  });

  useEffect(() => {
    async function prepareAuction() {
      console.log(
        metadataCid,
        auctionForm.values.reservePrice,
        auctionForm.values.startTime,
        auctionForm.values.endTime
      );
      try {
        // (await createAuction())
        //   .wait()
        //   .then((hash) => {
        //     console.log(hash);
        //     auctionForm.resetForm();
        //     setMetadataCid("");
        //   })
        //   .catch((error) => {
        //     console.log(error);
        //   });
        console.log(
          ethers.utils.parseUnits(
            auctionForm.values.reservePrice.toString(),
            "ether"
          )
        );
      } catch (error) {
        console.log(JSON.parse(JSON.stringify(error))?.reason);
      }
    }
    if (metadataCid) prepareAuction();
  }, [metadataCid]);

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
              <FileHandler imageUrl={imageUrl} setImageUrl={setImageUrl} />
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
                height: "510px",
                paddingRight: "1em",
              }}
            >
              <Box>
                <Input
                  mtOff
                  label="Title"
                  name="title"
                  value={auctionForm.values.title}
                  onChange={auctionForm.handleChange}
                />
              </Box>
              <Box>
                <Input
                  mtOff
                  type="number"
                  label="Reserve Price"
                  name="reservePrice"
                  value={auctionForm.values.reservePrice}
                  onChange={auctionForm.handleChange}
                />
              </Box>
              <Grid container spacing={2}>
                <Grid item md={6}>
                  <Input
                    mtOff
                    type="datetime-local"
                    label="Start Time"
                    name="startTime"
                    value={auctionForm.values.startTime}
                    onChange={auctionForm.handleChange}
                  />
                </Grid>
                <Grid item md={6}>
                  <Input
                    mtOff
                    type="datetime-local"
                    label="End Time"
                    name="endTime"
                    value={auctionForm.values.endTime}
                    onChange={auctionForm.handleChange}
                  />
                </Grid>
              </Grid>
              <Box>
                <InputTextArea
                  mtOff
                  label="Description"
                  name="description"
                  value={auctionForm.values.description}
                  onChange={auctionForm.handleChange}
                />
              </Box>
              <CustomButton
                size="large"
                fullWidth
                sx={{
                  mb: "1.5em",
                }}
                onClick={() => auctionForm.handleSubmit()}
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
