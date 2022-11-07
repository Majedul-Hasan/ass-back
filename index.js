const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/', (req, res) => {
    res.send('My server is Ready For Running')
})

app.listen(port, (req, res) => {
    console.log('Server is Running on port in ', port);
})