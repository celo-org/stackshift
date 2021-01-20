// This script requires that you have already deployed HelloWorld.sol with Truffle
// Go back and do that if you haven't already

// 1. Import web3 and contractkit 
const Web3 = require("web3")
const ContractKit = require('@celo/contractkit')

// 2. Import the getAccount function
const getAccount = require('./getAccount').getAccount

// 3. Init a new kit, connected to the alfajores testnet
const web3 = new Web3('https://alfajores-forno.celo-testnet.org')
const kit = ContractKit.newKitFromWeb3(web3)

// import HelloWorld info
const HelloWorld = require('./build/contracts/HelloWorld.json')

// Initialize a new Contract interface
async function initContract(){
    // Check the Celo network ID
    const networkId = await web3.eth.net.getId();
    const deployedNetwork = HelloWorld.networks[networkId];
    // Create a new contract instance with the HelloWorld contract info
    let instance = new web3.eth.Contract(
        HelloWorld.abi,
        deployedNetwork && deployedNetwork.address
    );

    getName(instance)
    setName(instance, "hello world!")
}

// Read the 'name' stored in the HelloWorld.sol contract
async function getName(instance){
    let name = await instance.methods.getName().call()
    console.log(name)
}

// Set the 'name' stored in the HelloWorld.sol contract
async function setName(instance, newName){
    let account = await getAccount()

    // Add your account to ContractKit to sign transactions
    // This account must have a CELO balance to pay tx fees, get some https://celo.org/build/faucet
    kit.connection.addAccount(account.privateKey)
    
    // Encode the transaction to HelloWorld.sol according to the ABI
    let txObject = await instance.methods.setName(newName)
    
    // Send the transaction
    let tx = await kit.sendTransactionObject(txObject, { from: account.address })

    let receipt = await tx.waitReceipt()
    console.log(receipt)
}

initContract()
