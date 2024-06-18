const fetch = require('node-fetch');
const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017'; // Replace with your MongoDB connection string
const dbName = 'StockSage';
const collectionNames = {
    autocomplete: 'autocomplete',
    stockDetails: 'stockDetails',
    summary:'summary'
};

async function fetchDataFromMongo(collectionName, query) {
    const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
  
    try {
        await client.connect();
        const database = client.db(dbName);
        const collection = database.collection(collectionName);
  
        // Performing a find operation with the provided query
        const cursor = await collection.find(query);
        const data = await cursor.toArray(); // Convert cursor to array of documents
  
        return data;
    } finally {
        await client.close();
    }
}

module.exports = {

    fetchDataFromMongo,
    collectionNames // Export collection names for external use
};
