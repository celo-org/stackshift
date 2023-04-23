const express = require("express");
const dotenv = require("dotenv");
dotenv.config();

const app = express()

app.get('/', (req, res) => {
    res.send('Hello World!')
})

const requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: {
        "apikey": process.env.apikey
    }
};

app.get('/prices', async (req, res) => {
    // fetch("https://api.apilayer.com/fixer/convert?to=kes&from=usd&amount=1", requestOptions)
    //     .then(response => response.text())
    //     .then(result => console.log(result))
    //     .catch(error => console.log('error', error));

        const resp = await fetch("https://api.apilayer.com/fixer/convert?to=kes&from=usd&amount=1", requestOptions);
        const json = await resp.json();
        console.log("resp", json);

        res.send(json);
        // res.json(await resp.json());
        // res.send("nothing")
})

const port = 3040;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})