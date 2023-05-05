import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div>
      <div className=" lg:flex lg:justify-between lg:w-[1200px] w-full mt-10">
        <div className=" flex flex-col justify-start">
          <div className=" text-5xl py-3 mb-4">
            <h2>Sell that item by raising an auction <br/>
            on this awesome platform
            </h2>
          </div>
          <div>
            <p className=" leading-6 text-lg">We provide you the opportunity to raise an auction to sell those items you have <br/>
            always wanted the world to see and appreciate. Our numerous users are happy<br/>
             and eager to bid for them. <span className=" font-bold">[Bid with $cUSD and earn $NwizuGold worth of the item]</span>
            </p>
          </div>
          <div>
          <Link href={"/list_item"}><button className=" border-black border-2 mt-5 px-5 py-2 text-xl rounded-xl hover:bg-yellow-200">List an item</button>
          </Link>
          </div>
          
        </div>
        <div className=" flex gap-5">
          <div className=" flex flex-col gap-3">
            <div className=" mt-5">
              <Image src={"/auction1.png"} alt="item" height={200} width={180}/>
            </div>
            <div className="">
              <Image src={"/auction2.png"} alt="item" height={200} width={180}/>
            </div>
          </div>
          <div className=" flex flex-col gap-3">
            <div className="">
              <Image src={"/auction3.jpeg"} alt="item" height={200} width={180}/>
            </div>
            <div className="">
              <Image src={"/auction4.jpeg"} alt="item" height={200} width={180}/>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  )
}
