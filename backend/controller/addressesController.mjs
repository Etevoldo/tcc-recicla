'use strict'

import { db } from "../models/init_models.mjs"
import geodesic from "geographiclib-geodesic"
const geod = geodesic.Geodesic.WGS84;
const Address = db.address;
const Buyer = db.buyer;

export async function retrieveAddress(req, res) {
    try {
        const address = await Address.findByPk(req.params.cep);

        res.status(200).json(address);
    } catch (error) {
        console.error(error);
        return res.status(404).send(
            { message: `CEP ${req.params.cep} não está nos dados cadastrados`});
    }
}

export async function retrieveAllAddresses(req, res) {
    try {
        const addresses = await Address.findAll();
        if (addresses.length === 0) res.status(404).send();

        //TODO pagination
        res.status(200).send({ 'endereços': addresses })
    } catch (error) {
        console.error(error);
        return res.status(404).send(
            { message: ``});
    }
}

export async function searchBuyers(req, res) {
    try {
        let finderAddress = await Address.findByPk(
            req.params.cep,
            { attributes: ['cep', 'latitude', 'longitude'] }
        );

        if (finderAddress === null) {
            console.log(
                "Address " +
                req.params.cep +
                " not found in local db using awesomeapi...");
            const response = await fetch(
                `https://cep.awesomeapi.com.br/json/${req.params.cep}`);
            finderAddress = await response.json();

            // renaming variables 
            finderAddress.latitude = finderAddress.lat;
            finderAddress.longitude = finderAddress.lng;

            console.log("Found");

            await Address.create({
                cep: finderAddress.cep,
                latitude: parseFloat(finderAddress.lat),
                longitude: parseFloat(finderAddress.lng)
            });
            console.log(`Insert cep: "${finderAddress.cep}" into local db`);
        }

        const addresses = await Address.findAll(
            { attributes: ['cep', 'latitude', 'longitude'] }
        );

        if (addresses.length === 0) res.status(404).send();

        const nearbyAddresses = [];

        // raio padrão 15km
        if (!req.params.radius) req.params.radius = 15000
        else req.params.radius = parseInt(req.params.radius);

        // calculo de zonas postais próximas
        for (const address of addresses) {
            const result = geod.Inverse(
                finderAddress.latitude, finderAddress.longitude,
                address.latitude, address.longitude);

            if (result.s12.toFixed(3) < req.params.radius) {
                nearbyAddresses.push(address.cep);
            }
        }

        // calculo de compradores próximos para cada zona postal
        const nearbyBuyers = [];
        for (const address of nearbyAddresses) {
            const buyers = await Buyer.findAll({
                where: {
                    cep: address
                },
            });

            for (const buyer of buyers) {
                nearbyBuyers.push({
                    id: buyer.id,
                    name: buyer.name,
                    email: buyer.email,
                    phoneNumber: buyer.phoneNumber,
                    cep: buyer.cep,
                    address: buyer.address,
                    addressNumber: buyer.addressNumber,
                });
            }
        }

        res.status(200).send({'compradoresProximos': nearbyBuyers});

    } catch (error) {
        console.error(error);
        return res.status(404).send(
            { message: ``});
    }
}

// tries to add an address via CEP, skips if address is already registered
export async function createAddress(req, res) {
    try {
        const address = await Address.findByPk(req.params.cep);

        if (address !== null) {
            res.status(400).send();
        }

        // insert into addresses db if a new address
        const response = await fetch(
            `https://cep.awesomeapi.com.br/json/${req.params.cep}`);
        const data = await response.json();

        const newAddress = await Address.create({
            cep: req.params.cep,
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lng)
        });

        res.status(201).json(newAddress);

    } catch (error) {
        console.error(error);
        return res.status(403).send({
            message: 'Não foi possivel cadastrar o comprador'});
    }
        return;
}

export async function deleteAddress(req, res) {
    try {
        await Address.destroy({
            where: {
                cep: req.params.cep
            }
        });
    } catch (error) {
        console.error(error);
        return res.status(403).send({
            message: 'Não foi possivel apagar o endereço'});
    }
    return;
}
