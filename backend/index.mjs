'use strict';

//import { db } from "./models/init_models.mjs"
import dotenv from  'dotenv';
import express from "express";
import { buyers } from './routes/buyer.mjs'
import { addresses } from './routes/addresses.mjs'
import { products } from './routes/product.mjs'
import { offers } from './routes/offer.mjs'
import morgan from 'morgan'

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/buyers', buyers);
app.use('/addresses', addresses);
app.use('/products', products);
app.use('/offers', offers);

app.get('/', (req, res) =>{
    res.send('Hello world!!\n');
    console.log(req.body.name);
});

async function syncTables(db) {
    await db.sequelize.sync({alter: true});
}

//syncTables(db);

const PORT = process.env.APP_PORT;
const HOST = process.env.APP_HOST;
app.listen(PORT, HOST, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on http://${HOST}:${PORT}`);
});

