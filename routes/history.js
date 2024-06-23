const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const query = {
            'ticker': keyword
        };

        // Fetch data from MongoDB
        const data = await fetchDataFromMongo(collectionNames.history, query);

        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching historical data');
    }
});

module.exports = router;
