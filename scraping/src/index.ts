import express from 'express';
import { addItemToDatabase, closePrismaConnection } from '../../prisma/prisma-adapter';
import { ItemModel } from '../../prisma/models/ItemModel';
import { maximumService } from './services/maximum/maximum-service';

const app = express();
const port = 3001;

app.get('/search/:query', async (req, res) => {
  const query: string = req.params.query;
  try {
    maximumService(query)
      .then((items) => {
        items?.map((item) => {
          addItemToDatabase(item)
            .then(() => {
              res.status(200).send(`Item ${item.name} added succesfully`);
              closePrismaConnection();
            })
            .catch((error) => {
              res.status(500).send("Server error :(");
              console.log(error);
            })
        })
      })
  }
  catch (err) {
    console.log(err);
  }
});

app.listen(port, async () => {
  console.log(`Scraper microservice is running at http://localhost:${port}`);
});