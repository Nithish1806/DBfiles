const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).send('Keyword query parameter is required');
        }

        // Fetch data from MongoDB (summary collection)
        const query = { 'ticker': keyword };
        const mongoData = await fetchDataFromMongo(collectionNames.summary, query);

        if (mongoData.length === 0) {
            return res.status(404).send('Data not found for the provided keyword');
        }

        // Extract relevant data from MongoDB result
        const tiingoData = mongoData[0]; // Assuming you only need the first document

        // Initialize data object for response
        const dataobj = {};

        // Process Tiingo API data if available
        if (tiingoData) {
            dataobj['lastPrice'] = tiingoData['last'] ? tiingoData['last'].toFixed(2) : '-';
            dataobj['prevClose'] = tiingoData['prevClose'] ? tiingoData['prevClose'].toFixed(2) : '-';
            dataobj['change'] = tiingoData['last'] && tiingoData['prevClose'] ?
                (tiingoData['last'] - tiingoData['prevClose']).toFixed(2) : '-';
            dataobj['changePercent'] = tiingoData['last'] && tiingoData['prevClose'] ?
                ((dataobj['change'] / tiingoData['prevClose']) * 100).toFixed(2) : '-';

            const currentTime = new Date();
            dataobj['currentTimeStamp'] = currentTime.toLocaleString();

            const tiingoTimestamp = new Date(tiingoData['timestamp']);
            dataobj['timestamp'] = tiingoTimestamp.toLocaleString();

            const secondsPassed = (currentTime.getTime() - tiingoTimestamp.getTime()) / 1000;
            dataobj['marketStatus'] = secondsPassed <= 60;

            dataobj['highPrice'] = tiingoData['high'] ? tiingoData['high'].toFixed(2) : '-';
            dataobj['lowPrice'] = tiingoData['low'] ? tiingoData['low'].toFixed(2) : '-';
            dataobj['midPrice'] = tiingoData['mid'] ? tiingoData['mid'].toFixed(2) : '-';
            dataobj['volume'] = tiingoData['volume'] ? tiingoData['volume'].toFixed(2) : '-';
            dataobj['bidPrice'] = tiingoData['bidPrice'] ? tiingoData['bidPrice'].toFixed(2) : '-';
            dataobj['bidSize'] = tiingoData['bidSize'] ? tiingoData['bidSize'].toFixed(2) : '-';
            dataobj['askPrice'] = tiingoData['askPrice'] ? tiingoData['askPrice'].toFixed(2) : '-';
            dataobj['askSize'] = tiingoData['askSize'] ? tiingoData['askSize'].toFixed(2) : '-';
            dataobj['openPrice'] = tiingoData['open'] ? tiingoData['open'].toFixed(2) : '-';

            // Example: Merge MongoDB data with Tiingo API data
            dataobj['mongoField1'] = mongoData[0].mongoField1; // Adjust as per your actual structure
            dataobj['mongoField2'] = mongoData[0].mongoField2; // Adjust as per your actual structure
            // Add more fields as needed
        }

        res.json(dataobj);
    } catch (error) {
        console.error('Error fetching data:', error);
        res.status(500).send('Error fetching data');
    }
});

module.exports = router;
