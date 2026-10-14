'use strict'

import { db } from "../models/init_models.mjs"
const Buyer = db.buyer;
const Address = db.address;

export async function retrieveAllBuyers(req, res) {
    try {
        const buyers = await Buyer.findAll();
        return res.status(200).send(JSON.stringify(buyers));
    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador não encontrado'});
    }
}

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

export async function retrieveBuyerProducts(req, res) {
    try {
        const buyer = await Buyer.findByPk(
            req.params.id,
        );

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

        const address = await Address.findByPk(insertedBuyer.cep);

        // insert into addresses db if a new address
        if (address === null) {
            const response = await fetch(
                `https://cep.awesomeapi.com.br/json/${insertedBuyer.cep}`);
            const data = await response.json();

            if (response.status === 200) {
                await Address.create({
                    cep: insertedBuyer.cep,
                    latitude: parseFloat(data.lat),
                    longitude: parseFloat(data.lng)
                });
            }
        }

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
        console.error(error);
        return res.status(403).send({ 
            message: 'Não foi possivel cadastrar o comprador'});
    }
    return;
}

export async function updateBuyer(req, res) {
    try {
        await Buyer.update(
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
