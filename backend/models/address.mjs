'use strict';

import { DataTypes, Model } from "sequelize";

function addressModel(sequelize) {
    class address extends Model {};
    address.init(
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
        }
    );
    return address;
}
export { addressModel };