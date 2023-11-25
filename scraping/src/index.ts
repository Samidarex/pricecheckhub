import express from 'express';
import { addItemsToDatabase, closePrismaConnection } from '../../prisma/prisma-adapter';
import getServicesData from './services/services';
import { getAllDataFromCache, getMemoryInfo } from '../../caching/cacheService';

const app = express();
const port = 3001;

app.get('/search/:query', async (req, res) => {
  const query: string = req.params.query;
  try {
    await getMemoryInfo();
  }
  catch (err) {
    res.status(500).send();
    console.log(err);
  }
});

app.listen(port, async () => {
  console.log(`Scraper microservice is running at http://localhost:${port}`);
});