'use strict'
import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;
const Product = db.product;

export async function retrieveProduct(req, res) {
    try {
        const product = await Product.findByPk(req.params.id);
        res.status(200).send({
            id: product.id,
            name: product.name,
            recicling_code: product.recicling_code
        });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function retrieveProducts(req, res) {
    try {
        const products = await Product.findAll();
        res.status(200).send(JSON.stringify(products));
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function createProduct(req, res) {
    try {
        const createdProduct = await Product.create({
            name: req.body.name,
            recicling_code: req.body.recicling_code,
        });
        res.status(201).send({
            id: createdProduct.id,
            name: createdProduct.name,
            recicling_code: createdProduct.recicling_code,
        });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function updateProduct(req, res) {
    try {
        await Product.update(
            { 
                name: req.body.name,
                recicling_code: req.body.recicling_code,
            },
            {
                where: {
                    id: req.params.id,
                },
            },
        );

        res.status(200).send({
            id: req.params.id,
            name: req.body.name,
            recicling_code: req.body.recicling_code,
        });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function deleteProduct(req, res) {
    try {
        await Product.destroy({ where: { id: req.params.id }});

        res.status(204);
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}