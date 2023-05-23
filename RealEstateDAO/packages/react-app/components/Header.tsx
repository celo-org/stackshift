import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="header">
      <Link href="/">
        <div className="logo">RealDAO</div>
      </Link>

      <div className="inner-header">
        <Link href="/governance">
          <button className="nav-item">Governance</button>
        </Link>
        <Link href="/dash">
          <button className="nav-item">App</button>
        </Link>

        <ConnectButton
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </div>
    </div>
  );
}
