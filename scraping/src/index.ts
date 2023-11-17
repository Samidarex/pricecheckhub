import express from 'express';
import axios from 'axios';
import cheerio from 'cheerio';
import prisma from 'db/prisma';

const app = express();
const port = 3001;

app.get('/search/:query', async (req, res) => {
  const query: unknown = req.params.query;

  try {
    const newData = await prisma.item.create({
      data: {
        name: "test",
        price: 1,
        image: "test",
        link: "test",
        isAvailable: true
      }
    });
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(port, () => {
  console.log(`Scraper microservice is running at http://localhost:${port}`);
});