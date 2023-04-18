import React, { useEffect, useState } from "react";
import styled from "@emotion/styled";
import { Box } from "@mui/material";

const BidInfo = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #13122b95;
  width: 100%;
  margin: 0 auto;
  padding: 0.75em;
  border-radius: 10px;

  div {
    color: #fff;
    span {
      display: block;

      &:nth-of-type(1) {
        font-size: 0.75em;
      }

      &:nth-of-type(2) {
        margin-top: 0.25em;
        font-size: 1.05em;
      }
    }
  }

  button {
    background-color: #005ce6;
    color: #fff;
    border: none;
    border-radius: 10px;
    padding: 0.5em 1em;
    font-size: 0.85em;
    min-height: 45px;
    cursor: pointer;
  }
`;

const Countdown = styled.div<{ ended: boolean }>`
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 0.9em;
  background-color: ${({ ended }) => (ended ? "#ff000095" : "#005ce695")};
  width: fit-content;
  padding: 0.5em 1em;
  border-radius: 50px;
  color: #ffffff;
`;

export default function AuctionCard({
  title,
  preview,
  endtime,
  highestBid,
  triggerBidModal,
  ended,
}: {
  title: string;
  preview: string;
  endtime: string;
  highestBid: number;
  triggerBidModal: () => void;
  ended: boolean;
}) {
  return (
    <Box
      sx={{
        backgroundImage: `url(${preview})`,
        backgroundSize: "contain",
        backgroundRepeat: "no-repeat",
        backgroundPosition: "center",
        borderRadius: "10px",
        boxShadow: "rgba(99, 99, 99, 0.2) 0px 2px 8px 0px",
        padding: "1em",
      }}
    >
      <CountDownTimer dateTime={endtime} ended={ended} />
      <Box
        sx={{
          height: "250px",
          display: "flex",
          alignItems: "flex-end",
          pb: ".35em",
          verticalAlign: "top",
        }}
      >
        <Box
          sx={{
            backgroundColor: "#ffffff75",
            padding: "0.5em 1em",
            borderRadius: "10px",
          }}
        >
          <span>{title}</span>
        </Box>
      </Box>
      <BidInfo>
        <div>
          <span>Current Bid</span>
          <span>{(highestBid / 10 ** 18).toFixed(2)} CELO</span>
        </div>
        <button onClick={triggerBidModal}>Place a bid</button>
      </BidInfo>
    </Box>
  );
}

const CountDownTimer = ({
  dateTime,
  ended,
}: {
  dateTime: string;
  ended: boolean;
}) => {
  const [state, setState] = useState<{
    days: string;
    hours: string;
    minutes: string;
    seconds: string;
    timeUp: boolean;
  }>({
    days: "0",
    hours: "00",
    minutes: "00",
    seconds: "00",
    timeUp: false,
  });

  useEffect(() => {
    let countdown = () => {
      let date = +new Date(parseInt(dateTime) * 1000);
      let difference = date - +new Date();
      if (difference < 1) {
        setState((prevState) => ({ ...prevState, timeUp: true }));
      } else {
        let days = Math.floor(difference / (1000 * 60 * 60 * 24));
        let hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
        let minutes = Math.floor((difference / (1000 * 60)) % 60);
        let seconds = Math.floor((difference / 1000) % 60);

        setState((prevState) => ({
          ...prevState,
          hours: hours.toString(),
          minutes: minutes.toString(),
          seconds: seconds.toString(),
          days: days.toString(),
        }));
      }
    };
    setInterval(countdown, 1000);

    return () => {
      clearInterval(countdown as any);
    };
  }, []);

  const { days, hours, minutes, seconds } = state;

  return (
    <Countdown ended={ended}>
      {ended ? (
        <span>Ended</span>
      ) : (
        <>
          <span>{days}d</span>
          <span>{hours}h</span>
          <span>{minutes}m</span>
          <span>{seconds}s</span>
        </>
      )}
    </Countdown>
  );
};
