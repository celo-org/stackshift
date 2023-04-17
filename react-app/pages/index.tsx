import { Box, Button } from "@chakra-ui/react"
import Image from "next/image"
import { useEffect, useState } from "react";

import { usePrepareContractWrite, useContractWrite, useNetwork, useProvider, useAccount } from 'wagmi';

import "../public/logo.svg";

import { abi } from "../contracts/Kobeni.json";

import axios from "axios";

// {
//   items:
//     [
//       {
//         "attributes": [
//           {
//             "trait_type": "hair pin",
//             "value": "red"
//           },
//         ],
//         "description": "Kobeni supremacy 🛐",
//         "image": "https://gateway.pinata.cloud/ipfs/Qmdp4hsndGBHdi8WgDfL7Dqd22mJK7gAakXdNLL7YYvoxb/2d861_16687191094222_1920.0.jpg",
//         "name": "Kobeni Supremacy",
//         "external_url": "https://twitter.com/jimii_47"
//       },
//       {
//         "attributes": [
//           {
//             "trait_type": "hair style",
//             "value": "pony tail"
//           },
//         ],
//         "description": "Kobeni supremacy 🛐",
//         "image": "https://gateway.pinata.cloud/ipfs/Qmdp4hsndGBHdi8WgDfL7Dqd22mJK7gAakXdNLL7YYvoxb/fakta-kobeni-chainsaw-man-4cc441a3d7d97a380baf10ac0b3ed374.jpg",
//         "name": "Kobeni Supremacy",
//         "external_url": "https://twitter.com/jimii_47"
//       },
//       {
//         "attributes": [
//           {
//             "trait_type": "hair pin",
//             "value": "red"
//           },
//         ],
//         "description": "Kobeni supremacy 🛐",
//         "image": "https://gateway.pinata.cloud/ipfs/Qmdp4hsndGBHdi8WgDfL7Dqd22mJK7gAakXdNLL7YYvoxb/kobeni-peace.webp",
//         "name": "Kobeni Supremacy",
//         "external_url": "https://twitter.com/jimii_47"
//       },
//       {
//         "attributes": [
//           {
//             "trait_type": "knife",
//             "value": "silver"
//           },
//         ],
//         "description": "Kobeni supremacy 🛐",
//         "image": "https://gateway.pinata.cloud/ipfs/Qmdp4hsndGBHdi8WgDfL7Dqd22mJK7gAakXdNLL7YYvoxb/fakta-kobeni-chainsaw-man-86c8bfe4caa81f8464fa1fcccd18ad13.jpg",
//         "name": "Kobeni Supremacy",
//         "external_url": "https://twitter.com/jimii_47"
//       }
//     ]
// }

let uris = [
  "https://gateway.pinata.cloud/ipfs/QmfSXnouXHemRQZvzmYpjJn1fr7cAf5udosLpsYP4RPRzR/calmKobeni.json",
  "https://gateway.pinata.cloud/ipfs/QmfSXnouXHemRQZvzmYpjJn1fr7cAf5udosLpsYP4RPRzR/panickedKobeni.json",
  "https://gateway.pinata.cloud/ipfs/QmfSXnouXHemRQZvzmYpjJn1fr7cAf5udosLpsYP4RPRzR/rattledKobeni.json",
  "https://gateway.pinata.cloud/ipfs/QmfSXnouXHemRQZvzmYpjJn1fr7cAf5udosLpsYP4RPRzR/scaredKobeni.json"
]

export default function Home() {
  const [items, setItems] = useState<any[]>();
  const { address } = useAccount();

  useEffect(() => {
    const fetchData = async () => {
      const responses = await Promise.all(uris.map(uri => fetch(uri)));
      const results = await Promise.all(responses.map(response => response.json()));
      setItems(results);
    };

    fetchData();
  }, []);

  let args: (`0x${string}` | string | undefined)[] = [
    address,
    uris[1]
  ]

  const { config } = usePrepareContractWrite({
    address: '0x9A6BA017A9d23E6307cEA0be8B8D54D8281D5de3',
    abi,
    functionName: 'safeMint',
    args
  })

  const { data, isLoading, isSuccess, write } = useContractWrite(config)



  return (
    <div>

      <Box display="flex" justifyContent="space-between" flexWrap="wrap">
        {
          items?.map((item: any, index: any) =>
            <Card
              key={index}
              name={item.name}
              image={item.image}
              onClick={() => { args.push(uris[index]); write?.() }}
            />
          )
        }
      </Box>

    </div>
  )
}


function Card({ name, image, onClick }: { name: string, image: string, onClick: () => void }) {

  return <Box>
    <Box textAlign="left" border="1px solid black" width={180} margin={3}>
      <Box>
        <Image
          src={image}
          alt="Card Picture"
          width={180}
          height={100}
        />
      </Box>
      <Box my="2" mx="1">
        <Box>
          {name}
        </Box>
        <Button onClick={onClick} padding="2" border="1px solid black" bg="none" height="20px" borderRadius="none">
          mint
        </Button>
      </Box>
    </Box>
  </Box>
}