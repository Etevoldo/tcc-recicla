'use strict';

import { DataTypes, Model } from "sequelize";

function productModel(sequelize) {
    class Product extends Model {};
    Product.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            // Codigos baseados no CONAMA nº 275 de 25/04/2001
            // Não usar código VERMELHO (plastico), visto que esse deve
            // Ser categorizado mais profundamente (PP)
            recicling_code:  DataTypes.STRING
        },
        {
            sequelize,
        }
    );
    return Product;
}

export { productModel };