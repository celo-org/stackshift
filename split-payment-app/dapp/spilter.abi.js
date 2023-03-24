export const abi = [
  {
    inputs: [
      {
        internalType: "uint256",
        name: "_numOfParticipants",
        type: "uint256",
      },
    ],
    name: "SetBillAmountAndParticipant",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "participants",
        type: "address[]",
      },
      {
        internalType: "uint256[]",
        name: "ratios",
        type: "uint256[]",
      },
    ],
    name: "SplitFundsByRatio",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
  {
    inputs: [],
    name: "billAmount",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "numParticipants",
    outputs: [
      {
        internalType: "uint256",
        name: "",
        type: "uint256",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "address[]",
        name: "participants",
        type: "address[]",
      },
    ],
    name: "splitFunds",
    outputs: [],
    stateMutability: "payable",
    type: "function",
  },
];
