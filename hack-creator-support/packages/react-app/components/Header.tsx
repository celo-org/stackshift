import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import Image from "next/image";
import TwitterConnect from "./TwitterConnect";
import { Address, useAccount } from "wagmi";
import React, { useEffect, useState } from "react";
import ConnectModal from "./Modal/ConnectModal";
import Link from "next/link";

export default function Header() {
  const { address } = useAccount()
  const [account, setAccount] = useState<Address>()
  const [showModal, setModal] = useState(false);

  useEffect(() => setAccount(address), [address])
  
    return (
      <Disclosure as="nav" className="bg-black text-white border-b border-slate-600">
        {({ open }) => (
          <>
            <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
              <div className="relative flex h-16 justify-between">
                <div className="absolute inset-y-0 left-0 flex items-center sm:hidden">
                  {/* Mobile menu button */}
                  <Disclosure.Button className="inline-flex items-center justify-center rounded-md p-2 text-black focus:outline-none focus:ring-1 focus:ring-inset focus:rounded-none focus:ring-black">
                    <span className="sr-only">Open main menu</span>
                    {open ? (
                      <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
                    ) : (
                      <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
                    )}
                  </Disclosure.Button>
                </div>
                <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
                  <div className="flex flex-shrink-0 items-center">
                    {/* <Image className="block h-8 w-auto sm:block lg:block" src="/logo.svg" width="24" height="24" alt="Celo Logo" /> */}
                    <Link href='/'>
                        <h1 className="text-2xl text-white text-yellow-500">DSupport</h1>
                    </Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/"
                      className="inline-flex items-center border-b-2 border-black px-1 pt-1 text-sm font-medium text-white"
                    >
                      Home
                    </Link>              
                  </div>
                  {account &&
                    <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                      <Link
                        href="/dashboard"
                        className="inline-flex items-center border-b-2 border-black px-1 pt-1 text-sm font-medium text-white"
                      >
                        Dashboard
                      </Link>
                    </div>
                  }
                </div>
                
              { account ? 
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  <TwitterConnect/>
                  <ConnectButton showBalance={{ smallScreen: true, largeScreen: false }} />
                  </div> :  
                  <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                    {/* <ConnectButton showBalance={{ smallScreen: true, largeScreen: false }} /> */}
                  </div>
                } 
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
                  {!account &&
                    <button onClick={() => setModal(true)} className="bg-blue-500 rounded-lg p-2">Connect Wallet</button>}
                  <ConnectModal show={showModal} onHide={() => setModal(false)} />
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                <Disclosure.Button
                  as="a"
                  href="/"
                  className="block border-l-4 border-black py-2 pl-3 pr-4 text-base font-medium text-black"
                >
                  Home
                </Disclosure.Button>
                {/* Add here your custom menu elements */}
              </div>
            </Disclosure.Panel>
          </>
        )}
      </Disclosure>
    )
  }