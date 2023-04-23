const express = require("express");
const dotenv = require("dotenv");
const axios= require("axios");

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
        const resp = await axios.get("https://api.apilayer.com/fixer/convert?to=kes&from=usd&amount=1", requestOptions);
        console.log("resp",resp.data);

        res.send(resp.data);
})

const port = 3040;

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`)
})