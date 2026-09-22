'use strict';

import config from 'dotenv'
import { Sequelize } from 'sequelize';

config();

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_NAME,
    process.env.DB_NAME,
    process.env.DB_NAME,
)

cons