'use strict';

import mysql from 'mysql2'
import { Sequelize } from 'sequelize';

const sequelize = new Sequelize(
    'reciclaapi',
    'root',
    'secret',
    {
        host: 'db',
        dialect: 'mysql',
        port: 3306,
    }
)

async function run() {
    try {
        await sequelize.authenticate();
        console.log('Sucessfull connection')
    } 
    catch (error) {
        console.error('Unnable to connect: ', error);
    }
}

run();