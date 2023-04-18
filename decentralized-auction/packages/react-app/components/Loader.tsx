import styled from "@emotion/styled";
import React from "react";

const LoaderBox = styled.div`
  width: 25px;
  height: 25px;
  border-radius: 50%;
  border: 3px solid #fff;
  border-top-color: #005ce6;
  animation: spin 1s linear infinite;

  @keyframes spin {
    to {
      transform: rotate(360deg);
    }
  }
`;

export default function Loader() {
  return <LoaderBox />;
}
