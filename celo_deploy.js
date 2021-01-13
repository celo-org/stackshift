const Kit = require('@celo/contractkit')
const HelloWorld = require('./build/contracts/HelloWorld.json')

const kit = Kit.newKit('https://alfajores-forno.celo-testnet.org')
const getAccount = require('./getAccount').getAccount

async function awaitWrapper(){
    let account = await getAccount()
    console.log(account.address)
    
    kit.connection.addAccount(account.privateKey) // this account must have a CELO balance to pay transaction fees

    let tx = await kit.connection.sendTransaction({
        from: account.address,
        data: HelloWorld.bytecode
    })

    const receipt = await tx.waitReceipt()
    console.log(receipt)
}

awaitWrapper()
