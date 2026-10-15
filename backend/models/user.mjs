'use strict';

import { DataTypes, Model } from "sequelize";

function userModel(sequelize) {
    class User extends Model {};
    User.init(
        {
            id: {
                type: DataTypes.INTEGER,
                allowNull: false,
                primaryKey: true,
                autoIncrement: true,
            },
            name: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: true,
            },
            passwordHash: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            role: {
                type: DataTypes.ENUM('ADMIN', 'BUYER'),
                allowNull: false,
            },
            mustChangePassword: {
                type: DataTypes.BOOLEAN,
                allowNull: false,
                defaultValue: false,
            },
            BuyerId: {
                type: DataTypes.INTEGER,
                allowNull: true,
            },
        },
        {
            sequelize,
        }
    );
    return User;
}

export { userModel };
