'use strict'

import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;

export async function retrieveBuyer(req, res) {
    try {
        const buyer = await Buyer.findByPk(req.params.id);
        return res.status(200).send({
            name: buyer.name,
            email: buyer.email,
            phoneNumber: buyer.phoneNumber,
            cep: buyer.cep,
            address: buyer.address,
            addressNumber: buyer.addressNumber,
        });

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador não encontrado'});
    }
}

export async function createBuyer(req, res) {
    //TODO checking if body is in right format
    try {
        const insertedBuyer = await Buyer.create({
            name: req.body.name,
            cpf: req.body.cpf,
            email: req.body.email,
            phoneNumber: req.body.phoneNumber,
            cep: req.body.cep,
            address: req.body.address,
            addressNumber: req.body.addressNumber,
        });
        //TODO register cordenates into addresses relation
        res.status(200).send({
            id: insertedBuyer.id,
            name: insertedBuyer.name,
            cpf: insertedBuyer.cpf,
            email: insertedBuyer.email,
            phoneNumber: insertedBuyer.phoneNumber,
            cep: insertedBuyer.cep,
            address: insertedBuyer.address,
            addressNumber: insertedBuyer.addressNumber
        });
    } catch (error) {
        return res.status(403).send({ message: 'Comprador não encontrado'});
    }
    return;
}

export async function updateBuyer(req, res) {
    res.send('Hello world!\n');
    return;
}

export async function deleteBuyer(req, res) {
    return;
}
