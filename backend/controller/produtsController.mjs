'use strict'

import { db } from "../models/init_models.mjs"

const Buyer = db.buyer
const Product = db.product

function serializeProduct(product) {
    const json = typeof product.toJSON === 'function' ? product.toJSON() : product
    return {
        id: json.id,
        name: json.name,
        recicling_code: json.recicling_code,
        ownerId: json.ownerId,
        owner: json.owner ? { id: json.owner.id, name: json.owner.name } : null,
        price: json.price ?? null,
    }
}

async function ownerInclude() {
    return {
        model: Buyer,
        as: 'owner',
        attributes: ['id', 'name'],
    }
}

export async function retrieveProduct(req, res) {
    try {
        const product = await Product.findByPk(
            req.params.id,
            {
                attributes: { exclude: ['createdAt', 'updatedAt'] },
                include: [await ownerInclude()],
            },
        )
        if (product === null) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        return res.status(200).json(serializeProduct(product))
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Produto Não encontrado' })
    }
}

export async function retrieveProducts(req, res) {
    try {
        const products = await Product.findAll({
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [await ownerInclude()],
            order: [['id', 'ASC']],
        })
        return res.status(200).json(products.map((product) => serializeProduct(product)))
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Produto Não encontrado' })
    }
}

export async function createProduct(req, res) {
    try {
        const name = String(req.body?.name || '').trim()
        const recicling_code = req.body?.recicling_code
        const price = Number(req.body?.price)

        if (!name || !recicling_code || !Number.isFinite(price) || price <= 0) {
            return res.status(400).json({ message: 'Informe nome, tipo e um preço maior que zero' })
        }

        const created = await Product.create({
            name,
            recicling_code,
            ownerId: req.user.buyerId,
            price: Math.round(price),
        })

        const product = await Product.findByPk(created.id, {
            attributes: { exclude: ['createdAt', 'updatedAt'] },
            include: [await ownerInclude()],
        })
        return res.status(201).json(serializeProduct(product))
    } catch (error) {
        console.error(error)
        return res.status(400).send({ message: 'Não foi possível cadastrar o produto' })
    }
}

export async function updateProduct(req, res) {
    try {
        const product = req.product ?? await Product.findByPk(req.params.id)
        if (product === null) {
            return res.status(404).send({ message: 'Produto Não encontrado' })
        }

        const updates = {}
        if (req.body?.name != null) {
            const name = String(req.body.name).trim()
            if (!name) {
                return res.status(400).json({ message: 'Informe o nome do produto' })
            }
            updates.name = name
        }
        if (req.body?.recicling_code != null) {
            updates.recicling_code = req.body.recicling_code
        }
        if (req.body?.price != null) {
            const price = Number(req.body.price)
            if (!Number.isFinite(price) || price <= 0) {
                return res.status(400).json({ message: 'Informe um preço maior que zero' })
            }
            updates.price = Math.round(price)
        }
        if (Object.keys(updates).length > 0) {
            await product.update(updates)
        }

        return res.status(200).send()
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Produto Não encontrado' })
    }
}

export async function deleteProduct(req, res) {
    try {
        const product = req.product ?? await Product.findByPk(req.params.id)
        if (product === null) {
            return res.status(404).send({ message: 'Produto Não encontrado' })
        }
        await product.destroy()
        return res.status(204).send()
    } catch (error) {
        console.error(error)
        return res.status(404).send({ message: 'Produto Não encontrado' })
    }
}
