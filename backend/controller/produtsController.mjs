'use strict'
import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;
const Product = db.product;

export async function retrieveProduct(req, res) {
    try {
        const product = await Product.findByPk(
            req.params.id,
            { attributes: { exclude: ['createdAt','updatedAt']} }
        );
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function retrieveProducts(req, res) {
    try {
        const products = await Product.findAll(
            { attributes: { exclude: ['createdAt','updatedAt']} });
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function createProduct(req, res) {
    try {
        const createdProduct = await Product.create(req.body);
        res.status(201).json(createdProduct);
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function updateProduct(req, res) {
    try {
        await Product.update(
            req.body,
            {
                where: {
                    id: req.params.id,
                },
            },
        );

        res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}

export async function deleteProduct(req, res) {
    try {
        await Product.destroy({ where: { id: req.params.id }});

        res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Produto Não encontrado'});
    }
}