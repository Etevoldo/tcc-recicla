'use strict';

import { DataTypes, Model } from "sequelize";

function addressModel(sequelize) {
    class Address extends Model {};
    Address.init(
        {
            cep: {
                type: DataTypes.STRING,
                allowNull: false,
                primaryKey: true
            },
            latitude:  {
                type: DataTypes.DOUBLE,
                allowNull: false
            },
            longitude: {
                type: DataTypes.DOUBLE,
                allowNull: false
            }
        },
        {
            sequelize
        }
    );
    return Address;
}
export { addressModel };