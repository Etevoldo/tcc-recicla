'use strict';

import dotenv from  'dotenv';
import { Sequelize } from 'sequelize';

import { productModel } from './products.mjs';
import { buyerModel } from './buyer.mjs';
import { offerModel } from './offer.mjs';
import { addressModel } from './address.mjs';

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

const db = {};

db.Sequelise = Sequelize;
db.sequelize = sequelize;
db.product = productModel(sequelize);
db.buyer = buyerModel(sequelize);
db.address = addressModel(sequelize);
db.offer = offerModel(sequelize, db.product, db.buyer);

db.product.belongsToMany(db.buyer, { through: db.offer });
db.buyer.belongsToMany(db.product, { through: db.offer });


export { db };