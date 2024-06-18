// routes/charts.js
const express = require('express');
const router = express.Router();
const { getTiingoData } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const { keyword, startDate, resampleFreq = '4min' } = req.query;
        const urlCharts = 'https://api.tiingo.com/iex/AAPL/prices?startDate=2019-09-10&resampleFreq=4min&token=dba09041d3f74d6661a2e620087813c35682f331'

        const data = await getTiingoData(urlCharts);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching chart data');
    }
});

module.exports = router;
