const app = require('express')();
const { port, mongoHost } = require('./config');
const { MongoClient } = require('mongodb');
const mongoUrl = `mongodb://${mongoHost}:27017`;

const mongoClient = new MongoClient(mongoUrl);

const dbName = 'learn-k8s';

app.get('/listRequests', async (req, res) => {
    const db = mongoClient.db(dbName);
    const collection = db.collection('requests');

    const requests = await collection.find({})

    res.json(requests)
})

app.post('/addRequest', async (req, res) => {
    const clientName = req.body.name

    const db = mongoClient.db(dbName);
    const collection = db.collection('requests');

    const request = await collection.insertOne({
        clientName,
        time: new Date().toISOString(),
        status: 'REQUESTED',
    })

    res.json(request)
})

app.listen(port, async () => {
    console.log(`Listening on port ${port}`);
    await mongoClient.connect();
})
