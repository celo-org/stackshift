import styled from "@emotion/styled";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

const Nav = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1em 0;
  width: 85%;
  margin: auto;

  a {
    color: #fff;
    text-decoration: none;
  }
`;

export default function Header() {
  return (
    <Nav>
      <Link href={"/"}>
        <Image src={"/favicon.ico"} alt="logo" width={40} height={40} />
      </Link>
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "2em",
        }}
      >
        <Link href={"/nfts"}>My NFT Domains</Link>
        <ConnectButton
          chainStatus="icon"
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </div>
    </Nav>
  );
}
