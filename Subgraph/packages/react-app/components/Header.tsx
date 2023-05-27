import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="header">
      <Link href="/">
        <div className="logo">Tasks Board</div>
      </Link>

      <div className="inner-header">
        <ConnectButton
          showBalance={{ smallScreen: true, largeScreen: false }}
        />
      </div>
    </div>
  );
}
