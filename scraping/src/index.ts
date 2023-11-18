import express from 'express';
import {addItemToDatabase, closePrismaConnection} from '../../prisma/prisma-adapter';
import { ItemModel } from '../../prisma/models/ItemModel';

const app = express();
const port = 3001;

app.get('/search/:query', async (req, res) => {
  const query: string = req.params.query;
  try {
    const newData : ItemModel = {
      name: "test",
      price: 3,
      link: query,
      image: "test",
    }
    await addItemToDatabase(newData)
    .then(() =>{
      res.send('Item added to the database');
      closePrismaConnection();
    })
    .catch((error) => {
      res.status(500).send('Internal server error');
      console.error('Error adding item to the database:', error);
    });
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(port, async () => {
  console.log(`Scraper microservice is running at http://localhost:${port}`);
});