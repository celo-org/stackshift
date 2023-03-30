// This script requires that you have already deployed HelloWorld.sol with Truffle
// Go back and do that if you haven't already

const privateKeyToAddress = require('@celo/utils/lib/address').privateKeyToAddress
require('dotenv').config()

// 1. Import web3 and contractkit 
const Web3 = require("web3")
const ContractKit = require('@celo/contractkit')

// 2. Init a new kit, connected to the alfajores testnet
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)

// import HelloWorld info
const SplitBill = require('./build/contracts/SplitBill.json')

// Test normal use
async function splitBill(instance){
    // Add your account to ContractKit to sign transactions
    // This account must have a CELO balance to pay tx fees, get some https://celo.org/build/faucet
    kit.connection.addAccount(process.env.PRIVATE_KEY)
    const address = privateKeyToAddress(process.env.PRIVATE_KEY)
    let amount = 30000;
    let addresses = ['0xE3173d67572762aA104aAE6daC7Cd4fCeA93d8D0', '0xdf45691dee724e91cD035233ccee2fF491DeB8cb'];

    let txObject = await instance.methods.split(amount,addresses)
    
    // Send the transaction
    let tx = await kit.sendTransactionObject(txObject, { from: address })


    let receipt = await tx.waitReceipt()
    console.log(receipt)
    console.log(amount, "CELO split and sent to", addresses)
    
}

async function addMoney(instance){
    kit.connection.addAccount(process.env.PRIVATE_KEY)
    const address = privateKeyToAddress(process.env.PRIVATE_KEY)
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SplitBill.networks[networkId];

    let amount = 500000;


    const tx = await kit.sendTransaction({
        from: address,
        to: deployedNetwork.address,
        value: amount,
      });


      const receipt = await tx.waitReceipt();
      console.log(receipt);
      console.log(amount, "Added to contract at: ", deployedNetwork.address)
}



// Initialize a new Contract interface
async function initContract(){
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = SplitBill.networks[networkId];
    // Create a new contract instance with the SplitBill contract info
    let instance = new web3.eth.Contract(
        SplitBill.abi,
        deployedNetwork && deployedNetwork.address
    );
    
    addMoney(instance)
    splitBill(instance)

    
}


initContract()
