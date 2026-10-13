'use strict'
import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;
const Product = db.product;

export async function retrieveProduct(req, res) {
    try {
        const product = await Product.findByPk(req.params.id);
        req.status(200).send({
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
        req.status(200).send(JSON.stringify(products));
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function createProduct(req, res) {
    try {
        const createdProduct = await Product.create({
            price: req.body.price,
            recicling_code: req.body.recicling_code,
        });
        req.status(201).send({
            price: createdProduct.price,
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
                price: req.body.name,
                recicling_code: req.body.recicling_code,
            },
            {
                where: {
                    id: req.params.id,
                },
            },
        );

        req.status(200).send({
            id: id,
            price: req.body.name,
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

        req.status(200).send({
            id: req.params.id,
            price: req.body.name,
            recicling_code: req.body.recicling_code,
        });
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}