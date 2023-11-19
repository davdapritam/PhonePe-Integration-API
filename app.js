const express = require('express');
const cors = require('cors');
const router = express.Router();
const app = express();
const bodyParser = require('body-parser');
const axios = require('axios');
const crypto = require('crypto');

const PORT = process.env.port || 3033;

app.use(cors());
app.use(express.json());

async function handlePayment(merchantId, merchantTransactionId, apiKey) {
    const headers = {
        'Content-Type': 'application/json',
        'X-MERCHANT-ID': merchantId,
        'X-VERIFY': apiKey,
        'accept': 'application/json',
        'Access-Control-Allow-Origin': '*'
    };

    console.log(merchantId);
    console.log(merchantTransactionId);
    console.log(apiKey);

    const url = `https://api-preprod.phonepe.com/apis/pg-sandbox/pg/v1/status/${merchantId}/${merchantTransactionId}`;

    try {
        const response = await axios.get(url, { headers });
        return response.data;
    } catch (error) {
        // Handle the error locally
        if (error.response && error.response.status === 401) {
            throw new Error('Unauthorized: Check your API key or credentials');
        } else {
            throw new Error('Failed to fetch data from the API');
        }
    }
}

app.get("/checkStatus/:merchantId/:merchantTransactionId/:apiKey", async (req, res) => {

    const merchantId = req.params.merchantId;
    const merchantTransactionId = req.params.merchantTransactionId;
    const apiKey = req.params.apiKey;
    const result = await handlePayment(merchantId, merchantTransactionId, apiKey);

    res.status(200).json({ message: result });
});

app.get("/getUniqueMerchantId", async (req, res) => {
    const transactionId = "TX" + Date.now()
    const merchatUserId = "MT" + Date.now();
    res.status(200).json({ Status: 1, data: { transactionId: transactionId, merchatUserId: merchatUserId } });
})

app.post('/getRequestPayload', async (req, res) => {
    const jsonObject = req.body;
    const jsonString = JSON.stringify(jsonObject);
    const base64String = Buffer.from(jsonString).toString('base64');
    const shaInputString = base64String + "/pg/v1/pay" + "875126e4-5a13-4dae-ad60-5b8c8b629035"
    const sha265Output = sha256(shaInputString) + "###1"

    res.status(200).json({ Status: 1, data: { base64: base64String, sha256: sha265Output } });
})

function sha256(inputString) {
    const hash = crypto.createHash('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}

app.listen(PORT, () => {
    console.log("Listening On Port ", PORT);
});