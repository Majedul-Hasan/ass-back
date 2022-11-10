const express = require('express');
const cors = require('cors')
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;
const morgan = require("morgan");

app.use(cors())



app.get('/', (req, res) => {
    res.send('My server is Ready For Running')
})
app.use(morgan('dev'));
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = `mongodb+srv://${process.env.PROJECT_NAME}:${process.env.PROJECT_PASSWORD}@cluster0.dfmvdpa.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });


async function run() {
    try {
        const serviceCollectionsAll = client.db('reviewService').collection('reviewCollection');

        const postCollection = client.db('reviewService').collection('singlereview');
        const userCollection = client.db('reviewService').collection('users');

        app.get('/services', async (req, res) => {
            const query = {};
            const cursor = serviceCollectionsAll.find(query);
            const result = await cursor.limit(3).toArray();
            res.send(result)
        })
        app.post('/services', async (req, res) => {
            const post = req.body;
            const result = await serviceCollectionsAll.insertOne(post);
            console.log(post)
            res.send(result.insertedId)
        })
        app.get('/services/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const services = await serviceCollectionsAll.findOne(query);
            res.send(services)
        })

        app.get('/allservices', async (req, res) => {
            const query = {};
            const cursor = serviceCollectionsAll.find(query);
            const result = await cursor.toArray();
            res.send(result)
        })

        app.get('/allservices/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const allservice = await serviceCollectionsAll.findOne(query);
            res.send(allservice)
        })

        app.post('/addreview', async (req, res) => {
            const sinReview = req.body;
            console.log(req.body);
            const result = await postCollection.insertOne(sinReview);
            res.send(result)
            // res.send('Something went wrong')
        })

        app.get('/review', async (req, res) => {
            const query = {};
            const cursor = postCollection.find(query);
            const result = await cursor.toArray();
            res.send(result) 
        })

       
        app.patch('/review/:id', async (req, res) => {
            const id = req.params.id;
            const {message} = req.body;
            console.log(message)
            const query = { _id: ObjectId(id) }
            const updateDoc = {
                $set: {
                    message: message,
                }
            }
            const result = await postCollection.updateOne(query, updateDoc);
            res.send(result)
        })



        app.delete('/review/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await postCollection.deleteOne(query);
            res.send(result)
        })


        app.get('/users', async (req, res) => {
            const query = {};
            const cursor = userCollection.find(query);
            const result = await cursor.toArray();
            res.send(result)        
           
        })
        app.post('/users', async (req, res) => {
                const user = req.body;
                console.log(req.body);
                const result = await userCollection.insertOne(user);
                res.send(result) 
            })    
     
    }
    finally {

    }

}
run().catch(error => console.log(error))

app.listen(port, (req, res) => {
    console.log('Server is Running on port in ', port);
})
