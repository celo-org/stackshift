import Image from "next/image";
import { Box } from "@mui/material";
import { ConnectButton } from "@rainbow-me/rainbowkit";

export default function Header() {
  return (
    <Box
      sx={{
        borderBottom: "1px solid #E5E7EB",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
          maxWidth: "1320px",
          mx: "auto",
        }}
      >
        <Image
          className="block h-8 w-auto sm:block lg:block"
          src="/logo.svg"
          width="120"
          height="40"
          alt="Celo Logo"
        />
        <ConnectButton
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </Box>
    </Box>
  );
}
