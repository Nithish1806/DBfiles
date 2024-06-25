// routes/news.js

const express = require('express');
const router = express.Router();
const { fetchDataFromMongo, collectionNames } = require('../services/fetchService');

router.get('/', async (req, res) => {
  try {
    const keyword = req.query.keyword; // Assuming you're passing keyword in query params
    const query = {
      'ticker': keyword
    };

    const data = await fetchDataFromMongo(collectionNames.news, query);
console.log("article:",data[0])
    if (!data[0] || !data[0].articles) {
      return res.status(404).json({ error: 'Articles not found for the given keyword' });
    }

    const newsObject = data[0].articles.map(article => ({
      publisher: article.source.name,
      publishedAt: article.publishedAt,
      title: article.title,
      description: article.description,
      url: article.url,
      urlToImage: article.urlToImage
    }));

    res.json(newsObject);
  } catch (error) {
    console.error('Error fetching news data:', error);
    res.status(500).send('Error fetching news data');
  }
});

module.exports = router;
