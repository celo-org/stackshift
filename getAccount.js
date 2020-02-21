const Web3 = require('web3')
const fs = require('fs');
var web3 = new Web3();

function getAccount() {
    return new Promise(resolve => {
        fs.readFile('./.secret', {encoding: 'utf-8'}, (err, data) => {
            if(data.length == 0){
                let randomAccount = web3.eth.accounts.create()
        
                fs.writeFile("./.secret", randomAccount.privateKey, (err) => {
                    if(err) {
                        return console.log(err);
                    }
                })

                resolve(randomAccount)
            } else {
                resolve(web3.eth.accounts.privateKeyToAccount(data))
            }
        })
    })
}

module.exports = {
    getAccount
}