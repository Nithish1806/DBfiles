const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const { keyword, startDate, resampleFreq = '4min' } = req.query;
        const query = {
            "ticker": keyword        };

        const data = await fetchDataFromMongo(collectionNames.daily, query);

        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching daily data');
    }
});

module.exports = router;
