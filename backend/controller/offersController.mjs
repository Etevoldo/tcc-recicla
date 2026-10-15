'use strict'

import { db } from "../models/init_models.mjs"
const Offer = db.offer;

export async function retrieveOffers(req, res) {
    try {
        const offers = await Offer.findAll();

        if (offers.length === 0) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        return res.status(200).json(offers);

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Nenhuma oferta cadastrada'});
    }
}

// specific offer
export async function retrieveOffer(req, res) {
    try {
        const BuyerId = req.params.BuyerId;
        const ProductId = req.params.ProductId;
        const offer = await Offer.findOne({
            where: {
                BuyerId: BuyerId,
                ProductId: ProductId
            }
        });

        if (offer === null) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }


        return res.status(200).send({
            BuyerId: offer.BuyerId,
            ProductId: offer.ProductId,
            price: offer.price
        })

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Ofertas não encontradas'});
    }
}

// all offers of a buyer
export async function retrieveOffersByBuyer(req, res) {
    try {
        const offers = await Offer.findAll(
            { where: { BuyerId: req.params.BuyerId } }
        );

        if (offers.length === 0) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        res.status(200).send(JSON.stringify(offers));

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Ofertas não encontradas'});
    }
}

export async function retrieveOffersByProduct(req, res) {
    try {
        const offers = await Offer.findAll(
            { where: { BuyerId: req.params.ProductId } }
        );

        if (offers.length === 0) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        res.status(200).send(JSON.stringify(offers));

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Oferta não encontrada'});
    }
}

export async function createOffer(req, res) {
    try {
        const insertedOffer = await Offer.create({
            BuyerId: req.body.buyerId,
            ProductId: req.body.productId,
            price: req.body.price
        });

        res.status(201).send({
            buyerId: insertedOffer.BuyerId,
            productId: insertedOffer.ProductId,
            price: insertedOffer.price
        });

    } catch (error) {
        console.error(error);
        return res.status(404).send(
            { message: 'Não foi possivel adicionar a oferta'}
        );
    }
}

export async function updateOffer(req, res) {
    try {
        const BuyerId = req.params.BuyerId;
        const ProductId = req.params.ProductId;

        const whereClause = { BuyerId: BuyerId, ProductId: ProductId };

        await Offer.update(
            { price: req.body.price },
            { where: whereClause },
        );

        const updatedOffer = await Offer.findOne({ where: whereClause });

        if (updatedOffer === null) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        res.status(200).send(JSON.stringify(updatedOffer));

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Oferta não encontrada'});
    }
}

export async function deleteBuyerOffers(req, res) {
    try {
        const BuyerId = req.params.BuyerId;

        const deletedCount = await Offer.destroy(
            { where: { BuyerId: BuyerId } }
        );

        if (deletedCount === 0) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        res.status(204).send();

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Comprador Não vende nada'});
    }
}

export async function deleteOffer(req, res) {
    try {
        const BuyerId = req.params.BuyerId;
        const ProductId = req.params.ProductId;

        const deletedCount = await Offer.destroy({
            where: {
                BuyerId: BuyerId,
                ProductId: ProductId
            },
        });

        if (deletedCount === 0) {
            return res.status(404).send({ message: 'Ofertas não encontradas'});
        }

        res.status(204).send();

    } catch (error) {
        console.error(error);
        return res.status(404).send({ message: 'Oferta não encontrada'});
    }
}