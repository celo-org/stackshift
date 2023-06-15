import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon } from "@heroicons/react/24/outline";
import Image from "next/image";

export default function Header() {
    return (
        <nav className="bg-prosperity flex justify-center border-b py-4  border-black">
            <Image
                className="block h-8 w-auto sm:block lg:block"
                src="/logo.svg"
                width="24"
                height="24"
                alt="Celo Logo"
            />
        </nav>
    );
}
