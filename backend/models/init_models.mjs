'use strict';

import dotenv from  'dotenv';
import { Sequelize } from 'sequelize';

dotenv.config();

const sequelize = new Sequelize(
    process.env.DB_NAME, // 'reciclaapi',
    process.env.DB_USER, // 'root',
    process.env.DB_PASSWORD, //'secret',
    {
        host: process.env.DB_HOST, //'db'
        dialect: 'mysql',
        port: process.env.DB_PORT,
    }
)
export { sequelize }