const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        if (!keyword) {
            return res.status(400).send('Keyword query parameter is required');
        }

        const query = { 'ticker': keyword };

        const data = await fetchDataFromMongo(collectionNames.stockDetails, query);

        if (!data || data.length === 0) {
            return res.status(404).json({ message: 'Stock details not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching stock details:', error);
        res.status(500).send('Error fetching stock details');
    }
});

module.exports = router;
