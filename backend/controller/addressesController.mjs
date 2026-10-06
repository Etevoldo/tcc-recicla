'use strict'

import { db } from "../models/init_models.mjs"
import geodesic from "geographiclib-geodesic"
const geod = geodesic.Geodesic.WGS84;
const Address = db.address;

export async function retrieveAddress(req, res) {
    try {
        const address = await Address.findByPk(req.params.cep);

        res.status(200).send({
            cep: address.cep,
            lat: address.latitude,
            longitude: address.longitude
        });
    } catch (error) {
        console.error(error);
        return res.status(404).send(
            { message: `CEP ${req.params.cep} não está nos dados cadastrados`});
    }
}

export async function retrieveAllAddresses(req, res) {
    try {
        const addresses = await Address.findAll();
        if (addresses.length() === 0) res.status(404).send();

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
        const response = await fetch(
            `https://cep.awesomeapi.com.br/json/${req.params.cep}`);
        const finderAddress = await response.json();

        const nearbyAddresses = [];

        const addresses = await Address.findAll();
        if (addresses.length === 0) res.status(404).send();

        for (const address of addresses) {
            const result = geod.Inverse(
                finderAddress.lat, finderAddress.lng,
                address.latitude, address.longitude);

            if (result.s12.toFixed(3) < 10000) {
                nearbyAddresses.push(address.cep);
            }
        }

        res.status(200).send({'Endereços próximos': nearbyAddresses});

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

        await Address.create({
            cep: req.params.cep,
            latitude: parseFloat(data.lat),
            longitude: parseFloat(data.lng)
        });

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
