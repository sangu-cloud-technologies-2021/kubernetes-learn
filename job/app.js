const { mongoHost } = require('./config');
const { MongoClient } = require('mongodb');
const mongoUrl = `mongodb://${mongoHost}:27017`;

const mongoClient = new MongoClient(mongoUrl);

const dbName = 'learn-k8s';

async function start() {
    await mongoClient.connect();

    const db = mongoClient.db(dbName);
    const collection = db.collection('requests');

    const requests = await collection.find({ status: 'REQUESTED' })

    await Promise.all(requests.map(request => {
        console.log(`Request ${request._id} from ${request.clientName} complated.`)
        return collection.updateOne({_id: request._id}, {
            state: 'COMPLETED'
        })
    }))
}

start()