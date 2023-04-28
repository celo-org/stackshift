import Image from "next/image";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <div
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      <div className="">
        <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-10">
          <div className="shadow-xl rounded-md relative h-fit">
            <div className="w-full">
              <Image
                src="/images/man.jpg"
                alt=""
                width={350}
                height={350}
                className="w-full object-contain relative"
              />
            </div>
            <div className="p-3">
              <div>
                <h3 className="font-bold text-lg mb-2"></h3>
                <p className="text-sm"></p>
              </div>
              <div className="mt-8">
                <div className="text-sm">
                  <p></p>
                </div>
                <div className="w-full">
                  <button
                    className="bg-green-500 text-white p-2 rounded mt-4 w-full"
                    // onClick={() => getAuctionIndex(auction.index)}
                  >
                    Mint
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="shadow-xl rounded-md relative h-fit">
            <div className="w-full">
              <Image
                src="/images/lagos.jpg"
                alt=""
                width={350}
                height={350}
                className="w-full object-contain relative"
              />
            </div>
            <div className="p-3">
              <div>
                <h3 className="font-bold text-lg mb-2"></h3>
                <p className="text-sm"></p>
              </div>
              <div className="mt-8">
                <div className="text-sm">
                  <p></p>
                </div>
                <div className="w-full">
                  <button
                    className="bg-green-500 text-white p-2 rounded mt-4 w-full"
                    // onClick={() => getAuctionIndex(auction.index)}
                  >
                    Mint
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
