import { useRouter } from 'next/router'
import Link from 'next/link';
import { Disclosure } from '@headlessui/react'
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline'
import { ConnectButton } from '@rainbow-me/rainbowkit'
// import CreateAccountModal from '@/components/CreateAccountModal'

export default function DashboardHeader() {

  const router = useRouter()

    return (
      <Disclosure as="nav" className="border-b border-black">
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
                    <Link href="/" className="font-semibold">DAOAnalyzer</Link>
                  </div>
                  <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                    <Link
                      href="/"
                      className={`inline-flex items-center ${router.pathname === '/' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-medium`}
                    >
                      About
                    </Link>
                    <Link
                      href="/"
                      className={`inline-flex items-center ${router.pathname === '/my-jobs' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-medium`}
                    >
                      DAO
                    </Link>
                    <Link
                      href="/"
                      className={`inline-flex items-center ${router.pathname === '/my-jobs' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-medium`}
                    >
                      Team
                    </Link>
                    <Link
                      href="/"
                      className={`inline-flex items-center ${router.pathname === '/my-jobs' ? 'border-b-2 border-black' : ''} px-1 pt-1 text-sm font-medium`}
                    >
                      Contact Us
                    </Link>
                  </div>
                </div>
                <div className="absolute inset-y-0 right-0 flex items-center pr-2 sm:static sm:inset-auto sm:ml-6 sm:pr-0">

                {/*<CreateAccountModal />*/}

                <button onClick={() => router.push('/app')} className="bg-gradient-to-r from-red-500 to-blue-500 text-white font-semibold py-2 px-4 rounded text-white mr-4">Launch Dapp</button>

                <ConnectButton showBalance={{smallScreen: true, largeScreen: false}} />
                </div>
              </div>
            </div>
  
            <Disclosure.Panel className="sm:hidden">
              <div className="space-y-1 pt-2 pb-4">
                <Disclosure.Button
                  as="a"
                  href="#"
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