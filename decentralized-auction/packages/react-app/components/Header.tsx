import { Box } from "@mui/material";
import CustomConnectBtn from "./CustomConnectBtn/CustomConnectBtn";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import styled from "@emotion/styled";

export default function Header() {
  return (
    <Box
      display={"flex"}
      alignItems={"center"}
      justifyContent={"space-between"}
      borderBottom={"1px solid #eaeaea"}
      px={2}
    >
      <Image alt="logo" src="/logo.jpeg" width={50} height={50} />

      <Box display={"flex"} alignItems={"center"} gap={4}>
        <Box display={"flex"} alignItems={"center"}>
          <NavLink title="Ongoing" route="/" />
          <NavLink title="Create" route="/create" />
          <NavLink title="My Auctions" route="/my-auctions" />
        </Box>
        <CustomConnectBtn />
      </Box>
    </Box>
  );
}

const NavLink = ({ title, route }: { title: string; route: string }) => {
  return (
    <Box
      sx={{
        textDecoration: "none",
        padding: "1em",
      }}
    >
      <Link
        style={{
          textDecoration: "none",
          color: "#000",
        }}
        href={route}
      >
        {title}
      </Link>
    </Box>
  );
};
