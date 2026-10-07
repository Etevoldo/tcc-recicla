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
            name: DataTypes.STRING,
            // Codigos baseados no CONAMA nº 275 de 25/04/2001
            // Não usar código VERMELHO (plastico), visto que esse deve
            // Ser categorizado mais profundamente (PP)
            recicling_code: DataTypes.ENUM(
                'AZUL',    // Papel ou papelão
                'VERDE',   // Vidro
                'AMARELO', // Metal
                'PRETO',   // Madeira
                'LARANJA', // Resíduos perigosos
                'BRANCO',  // Resíduos ambulatoriais e de serviços de saúde
                'ROXO',    // Resíduos radioativos
                'MARROM',  // Resíduos Organicos
                'PET',     // Polietileno tereftalato
                'PEAD',    // Polietileno de alta densidade
                'PVC',     // Policloreto de vinila
                'PEBD',    // Polietileno de baixa densidade
                'PP',      // Polipropileno
                'PS',      // Poliestireno
                'O'        // Outros
            )
        },
        {
            sequelize,
        }
    );
    return Product;
}

export { productModel };