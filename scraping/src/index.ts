import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';

const app = express();
const port = 3001;

app.get('/scrape', async (req, res) => {

});

app.listen(port, () => {
  console.log(`Scraper microservice is running at http://localhost:${port}`);
});