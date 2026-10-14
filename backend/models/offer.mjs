'use strict';

import { DataTypes, Model } from "sequelize";

function offerModel(sequelize, product, buyer) {
    class Offer extends Model {};
    Offer.init({
            price: {
                type: DataTypes.INTEGER, // em centavos
                allowNull: false
            }
        },
        {
            sequelize,
            timestamps: false
        });
    return Offer;
}

export { offerModel };