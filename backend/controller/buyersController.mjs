'use strict'

import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;
const Address = db.address;

async function ensureAddress(cep) {
    const normalized = String(cep || '').replace(/\D/g, '')
    if (normalized.length !== 8) return

    const address = await Address.findByPk(normalized)
    if (address !== null) return

    const response = await fetch(`https://cep.awesomeapi.com.br/json/${normalized}`)
    const data = await response.json()
    if (response.status === 200 && data.lat != null && data.lng != null) {
        await Address.create({
            cep: normalized,
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lng),
        })
    }
}

export async function retrieveAllBuyers(req, res) {
    try {
        const buyers = await Buyer.findAll(
            { attributes: { exclude: ['createdAt','updatedAt']} }
        );
        return res.status(200).send(JSON.stringify(buyers));
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador não encontrado'});
    }
}

export async function retrieveBuyer(req, res) {
    try {
        const buyer = await Buyer.findByPk(
            req.params.id,
            { attributes: { exclude: ['createdAt','updatedAt']} }
        );
        return res.status(200).json(buyer);

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador não encontrado'});
    }
}

export async function retrieveBuyerProducts(req, res) {
    try {
        const buyer = await Buyer.findByPk(req.params.id);

        if (buyer === null) {
            return res.status(404).send({ message: 'Comprador não encontrado'});
        }

        const products = await buyer.getProducts(
            { attributes: { exclude: ['createdAt','updatedAt']} }
        );

        res.status(200).send(JSON.stringify(products));
    
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador não tem produtos'});
    }
}

export async function createBuyer(req, res) {
    try {
        const body = { ...req.body }
        if (body.cep) {
            body.cep = String(body.cep).replace(/\D/g, '')
        }
        const insertedBuyer = await Buyer.create(body);
        await ensureAddress(insertedBuyer.cep)
        res.status(200).json(insertedBuyer);
    } catch (error) {
        console.error(error);
        return res.status(403).send({ 
            message: 'Não foi possivel cadastrar o comprador'});
    }
    return;
}

export async function updateBuyer(req, res) {
    try {
        const buyer = await Buyer.findByPk(req.params.id)
        if (buyer === null) {
            return res.status(404).send({ message: 'Comprador Não encontrado'});
        }

        const body = { ...req.body }
        if (body.cep != null) {
            body.cep = String(body.cep).replace(/\D/g, '')
        }
        await buyer.update(body)
        await ensureAddress(buyer.cep)

        res.status(200).send();
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador Não encontrado'});
    }
    return;
}

export async function deleteBuyer(req, res) {
    try {
        await Buyer.destroy({ where: { id: req.params.id }});

        res.status(204).send();
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador Não encontrado'});
    }
}
