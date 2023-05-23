import React, { useEffect, useState } from "react";
import {
  abi as mAbi,
  address as mAddress,
} from "@dynamic-nft/hardhat/deployments/alfajores/Membership.json";
import { useCelo } from "@celo/react-celo";
import { parseEther } from "ethers/lib/utils.js";

const capitalized = (word: string) =>
  word.charAt(0).toUpperCase() + word.slice(1);

export default function Home() {
  const [membership, setMembership] = useState(null);
  const { kit, address } = useCelo();
  const membershipContract = new kit.connection.web3.eth.Contract(
    mAbi,
    mAddress
  );

  useEffect(() => {
    const getMembership = async () => {
      const uri = await membershipContract.methods.tokenURI(0).call();

      if (uri) {
        const pinnataRes = await fetch(uri);
        const data = await pinnataRes.json();

        console.log(data);

        setMembership(data);
      }
    };

    getMembership();
  }, [address]);

  const perkComponent = (perk: string) => {
    let trait = perk.split("_");
    trait[0] = capitalized(trait[0]);

    return (
      <li key={perk} className="text-white flex gap-x-3">
        <svg
          className="h-6 w-5 flex-none text-indigo-600"
          viewBox="0 0 20 20"
          fill="#fff"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clipRule="evenodd"
          ></path>
        </svg>
        {trait.join(" ")}
      </li>
    );
  };

  return membership == null ? (
    ""
  ) : (
    <div className="w-[450px] pb-10  bg-[#040404] mx-auto rounded-xl">
      <img
        src={membership.image}
        // src="https://gateway.pinata.cloud/ipfs/QmNwMoD7euKmDE2dugXNWuiPgy7RNB4WkEkU3VuFcFVcj3/silver.gif"
        alt="Silver Plan"
        className="w-[270px] h-[200] mx-auto"
      />
      <div className="px-6">
        <p className="text-white font-bold mb-2">{membership.name} #ID 0</p>
        <p className="text-white">
          Initial purchase includes a lifetime membership for the Stackshift
          Boat club.
        </p>
        <div className="mt-10 flex items-center gap-x-4">
          <h4 className="text-white flex-none text-sm font-semibold leading-6">
            What’s included
          </h4>
          <div className="text-white h-px flex-auto bg-gray-100"></div>
        </div>
        <ul
          role="list"
          className=" mt-8 grid grid-cols-1 gap-4 text-sm leading-6 text-gray-600 sm:grid-cols-2 sm:gap-6"
        >
          {membership.attributes.map(
            (attribute) =>
              attribute.value == true && perkComponent(attribute.trait_type)
          )}
        </ul>

        <p className="mt-6 text-xs leading-5 text-white text-center">
          Add more to your club balance to earn more perks
        </p>
      </div>
    </div>
  );
}