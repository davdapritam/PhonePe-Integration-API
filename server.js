const express = require('express');
const app = express();
const bodyParser = require('body-parser');

const PORT = process.env.port || 3034;

app.use(bodyParser.urlencoded({ extended: true }));

app.post('/serverCallBack', async (req, res) => {

    const requestBody = req.body;

    if (requestBody.code == "PAYMENT_SUCCESS") {
        res.redirect(`http://localhost:4200/cart/${requestBody.transactionId}/${requestBody.amount}/${requestBody.providerReferenceId}/s`);
    } else {
        res.redirect(`http://localhost:4200/cart/${requestBody.transactionId}/${requestBody.amount}/${requestBody.providerReferenceId}/f`);
    }
})


app.listen(PORT, () => {
    console.log("Listening On Port ", PORT);
});