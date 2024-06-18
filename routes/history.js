// routes/history.js
const express = require('express');
const router = express.Router();
const { getTiingoData } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const { keyword, startDate } = req.query;
        const date = new Date(startDate);
        date.setFullYear(date.getFullYear() - 2);
        const formattedDate = date.toISOString().split('T')[0];
        const urlCharts = 'https://api.tiingo.com/tiingo/daily/'+keyword+'/prices?startDate='+formattedDate+'&token=dba09041d3f74d6661a2e620087813c35682f331'
        const data = await getTiingoData(urlCharts);
        res.json(data);
    } catch (error) {
        res.status(500).send('Error fetching historical data');
    }
});

module.exports = router;
