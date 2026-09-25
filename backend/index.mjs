'use strict';

import dotenv from  'dotenv';
import express from "express";
import { buyers } from './routes/buyer.mjs'
import morgan from 'morgan'

dotenv.config();
const app = express();

app.use(express.json());
app.use(morgan('tiny'));
app.use('/buyers', buyers);

app.get('/', (req, res) =>{
    res.send('Hello world!!\n');
    console.log(req.body.name);
});

async function syncTables(db) {
    await db.sequelize.sync({force: true});
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

