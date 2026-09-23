'use strict';

import { db } from "./models/init_models.mjs";
import express from "express"

const app = express();

app.get('/', (req, res) =>{
    res.send('Hello world\n');
});

async function syncTables(db) {
    await db.sequelize.sync({force: true});
}

syncTables(db);

try {
  await db.sequelize.authenticate();
  console.log('Connection has been established successfully.');
} catch (error) {
  console.error('Unable to connect to the database:', error);
}

const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);

console.log(`listening on http://${HOST}:${PORT}`);
