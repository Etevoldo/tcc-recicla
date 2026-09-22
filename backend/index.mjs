'use strict';

import { sequelize } from "./models/init_models.mjs";
import express from "express"

const app = express();

app.get('/', (req, res) =>{
    res.send('Hello world\n');
});

const PORT = 3000;
const HOST = '0.0.0.0';
app.listen(PORT, HOST);

console.log(`listening on http://${HOST}:${PORT}`);
