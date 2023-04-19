import styled from "@emotion/styled";
import { useContractWrite } from "wagmi";

import abi from "@/utils/abi.json";
import { useState } from "react";
import domainPrice from "@/functions/domainPrice";
import { notify } from "@/functions/notify";

const CardContainer = styled.div`
  width: 26em;
  background-color: #ffffff;
  color: #000;
  margin: 1em auto;
  padding: 1em;
  font-size: 1.75em;
  border-radius: 4px;
  border-left: 7px solid #35d075;
  display: flex;
  align-items: center;
  box-shadow: rgba(144, 171, 191, 0.42) 3px 4px 20px 0px;
`;

const Button = styled.button`
  outline: none;
  border: none;
  background-color: #35d075;
  color: #ffffff;
  font-size: 0.75em;
  padding: 0.75em 2.5em;
  border-radius: 4px;
  cursor: pointer;

  &:disabled {
    background-color: #c7d3e3;
    color: #ffffff;
    cursor: not-allowed;
  }
`;

export default function Card({
  username,
  available = false,
  resetUsername,
}: {
  username: string;
  available?: boolean;
  resetUsername: () => void;
}) {
  const [registeringDomain, setRegisteringDomain] = useState(false);
  const { writeAsync: registerDomain } = useContractWrite({
    abi,
    mode: "recklesslyUnprepared",
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "register",
    overrides: {
      value: domainPrice(username),
    },
    args: [username],
  });

  const domainCliamHandler = async () => {
    setRegisteringDomain(true);
    try {
      (await registerDomain())
        .wait()
        .then(() => {
          setRegisteringDomain(false);
          resetUsername();
          notify("success", "Nft Domain Claimed Successfully");
        })
        .catch(() => {
          setRegisteringDomain(false);
          notify("error", "Could not complete nft claim");
        });
    } catch (error) {
      setRegisteringDomain(false);
      notify("error", "Could not complete nft claim");
    }
  };

  return (
    <CardContainer>
      <div
        style={{
          flex: 1,
        }}
      >
        <span
          style={{
            color: "#35d075",
          }}
        >
          {username}
        </span>
        <span
          style={{
            color: "#FBCC5C",
          }}
        >
          .celo
        </span>
      </div>
      {available ? (
        <Button onClick={domainCliamHandler} disabled={registeringDomain}>
          {registeringDomain ? "Claiming..." : "Claim"}
        </Button>
      ) : (
        <div
          style={{
            color: "#c7d3e3",
            fontSize: ".75em",
            userSelect: "none",
          }}
        >
          Unavailable
        </div>
      )}
    </CardContainer>
  );
}
