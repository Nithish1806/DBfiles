// routes/autocomplete.js

const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames} = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        console.log(keyword)
        if (!keyword) {
            return res.status(400).send('Keyword query parameter is required');
        }

        const query = { 'name': new RegExp(keyword, 'i') };

        const data = await fetchDataFromMongo(collectionNames.autocomplete,query);

        if (!data) {
            return res.status(404).json({ message: 'Data not found' });
        }

        res.json(data);
    } catch (error) {
        console.error('Error fetching autocomplete data:', error);
        res.status(500).send('Error fetching autocomplete data');
    }
});

module.exports = router;
