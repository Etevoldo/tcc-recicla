'use strict';

import { DataTypes, Model } from "sequelize";

function buyerModel(sequelize) {
    class Buyer extends Model {};
    Buyer.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: DataTypes.STRING,
            cpf: DataTypes.STRING,
            email: DataTypes.STRING,
            phoneNumber: DataTypes.STRING,
            cep: DataTypes.STRING,
            address: DataTypes.STRING,
            addressNumber: DataTypes.STRING
        }
    );
    return Buyer;
}

export { buyerModel };