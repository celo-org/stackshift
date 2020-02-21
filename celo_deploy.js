const Kit = require('@celo/contractkit')
const HelloWorld = require('./build/contracts/HelloWorld.json')

const kit = Kit.newKit('https://alfajores-forno.celo-testnet.org')

const getAccount = require('./getAccount').getAccount

async function awaitWrapper(){
    let account = await getAccount()
    kit.addAccount(account.privateKey)

    let tx = await kit.sendTransaction({
        from: account.address,
        data: HelloWorld.bytecode
    })
    const receipt = await tx.waitReceipt()
    console.log(receipt)
}

awaitWrapper()