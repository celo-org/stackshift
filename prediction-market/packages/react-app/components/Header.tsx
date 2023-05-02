import styled from "@emotion/styled";
import { Disclosure } from "@headlessui/react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

const Nav = styled.nav`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 80%;
  margin: auto;
  padding: 0.25em 0;
`;

export default function Header() {
  return (
    <Nav>
      <div className="flex flex-shrink-0 items-center">
        <Image
          className="block h-8 w-auto sm:block lg:block"
          src="/logo.svg"
          width="80"
          height="80"
          alt="Celo Logo"
          style={{
            filter: "invert(1)",
          }}
        />
      </div>
      <div>
        <ConnectButton
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </div>
    </Nav>
  );
}
