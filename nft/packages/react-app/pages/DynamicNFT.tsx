import React, { useEffect, useState } from "react";
import DynamicNFT from "../../";

interface NFTMetadata {
  name: string;
  description: string;
  image: string;
}

interface Props {
  contract: string;
  tokenId: string;
}

export const DynamicNFT = () => {
  return <div>Hello</div>;
};
