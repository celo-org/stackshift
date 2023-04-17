import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <div className="header">
      <div className="header-inner">
        <div className="header-inner3">
          <Link href="/">
            <div className="logo">Auktion</div>
          </Link>

          <div className="header-inner2">
            <Link href="/all">
              <div>Find Items</div>
            </Link>

            <Link href="/profile">
              <div>Your Auctions</div>
            </Link>
          </div>
        </div>

        <div className="header-inner4">
          <Link href="/auction">
            <button className="hbut">Create Auction</button>
          </Link>

          <ConnectButton
            showBalance={{ smallScreen: true, largeScreen: false }}
          />
        </div>
      </div>
    </div>
  );
}
