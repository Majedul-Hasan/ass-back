const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;

app.use(cors())

app.get('/', (req, res) => {
    res.send('My server is Ready For Running')
})


const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = `mongodb+srv://${process.env.PROJECT_NAME}:${process.env.PROJECT_PASSWORD}@cluster0.dfmvdpa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    const serviceCollectionsAll = client.db('reviewService').collection('reviewCollection');

    app.get('/services', async (req, res) => {
        const query = {};
        const cursor = serviceCollectionsAll.find(query);
        const result = await cursor.limit(3).toArray();
        res.send(result)
    })

    app.get('/allservices', async (req, res) => {
        const query = {};
        const cursor = serviceCollectionsAll.find(query);
        const result = await cursor.toArray();
        res.send(result)
    })

}
run().catch(error => console.error(error))

app.listen(port, (req, res) => {
    console.log('Server is Running on port in ', port);
})
