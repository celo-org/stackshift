import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";

export default function Header() {
  return (
    <div className="header">
      <div className="logo">CarbonDAPP</div>
      <ConnectButton showBalance={{ smallScreen: true, largeScreen: false }} />
    </div>
  );
}
