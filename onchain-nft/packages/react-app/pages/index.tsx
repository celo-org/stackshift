import Card from "@/components/Card";
import Form from "@/components/Form";
import styled from "@emotion/styled";
import { useState } from "react";
import { useContractRead } from "wagmi";

import abi from "@/utils/abi.json";

const Logo = styled.img`
  width: 300px;
  height: 150px;
  margin: 3em auto 0;
  display: block;
  object-fit: cover;
  object-position: center center;
`;

const H1 = styled.h1<{ fontSize?: string }>`
  font-size: ${({ fontSize }) => fontSize || "2.5rem"};
  font-weight: 700;
  text-align: center;
  color: #fff;
`;

export default function Home() {
  const [name, setName] = useState("");
  const { data, refetch } = useContractRead({
    abi,
    address: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS as `0x${string}`,
    functionName: "getAddress",
    args: [name],
  });

  const formSubmitHandler = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    refetch();
  };

  const resetUsername = () => setName("");

  return (
    <div>
      <Logo src="/old-logo.svg" />
      <H1>Search .celo nft</H1>
      <Form
        name={name}
        setName={setName}
        formSubmitHandler={formSubmitHandler}
      />
      {data && name.length > 2 ? (
        <Card
          username={name}
          resetUsername={resetUsername}
          available={data === "0x0000000000000000000000000000000000000000"}
        />
      ) : null}
    </div>
  );
}
