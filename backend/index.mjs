'use strict';

import dotenv from  'dotenv';
import { db } from "./models/init_models.mjs";
import express from "express";

dotenv.config();
const app = express();

app.get('/', (req, res) =>{
    res.send('Hello world!\n');
});

async function syncTables(db) {
    await db.sequelize.sync({force: true});
}

//syncTables(db);

try {
  await db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const PORT = process.env.APP_PORT;
const HOST = process.env.APP_HOST;
app.listen(PORT, HOST, (error) => {
  if (error) {
    throw error;
  }
  console.log(`listening on http://${HOST}:${PORT}`);
});

