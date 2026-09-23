'use strict';

import { DataTypes, Model } from "sequelize";

function offerModel(sequelize, product, buyer) {
    class Offer extends Model {};
    Offer.init({
            BuyerId: {
                type: DataTypes.INTEGER,
                references: {
                    model: buyer,
                    key: 'id'
                }
            },
            ProductId: {
                type: DataTypes.INTEGER,
                references: {
                    model: product,
                    key: 'id'
                }
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false
            }
        },
        {
            sequelize,
        });
    return Offer;
}

export { offerModel };