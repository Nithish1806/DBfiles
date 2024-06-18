// routes/news.js
const express = require('express');
const router = express.Router();
const { getNewsData } = require('../services/fetchService');

router.get('/', async (req, res) => {
    try {
        const keyword = req.query.keyword;
        const urlNews = 'https://newsapi.org/v2/everything?apiKey=6e16e72a27944e5a9ba21dd5a03fe420&q='+keyword;

        const data = await getNewsData(urlNews);

        const newsObject = data.articles.slice(0, 20).map(article => ({
            publisher: article.source.name,
            publishedAt: article.publishedAt,
            title: article.title,
            description: article.description,
            url: article.url,
            urlToImage: article.urlToImage
        }));

        res.json(newsObject);
    } catch (error) {
        res.status(500).send('Error fetching news data');
    }
});

module.exports = router;
