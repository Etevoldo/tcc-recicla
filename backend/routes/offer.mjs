'use strict'

import express from "express"
import * as controller from "../controller/offersController.mjs"

const router = express.Router();

// basic crud
router.get('/:BuyerId', controller.retrieveOffersByBuyer);
router.get('/:ProductId', controller.retrieveOffersByProduct);
router.get('/:BuyerId/:ProductId', controller.retrieveOffer);
router.get('/', controller.retrieveOffers);

router.post('/', controller.createOffer);
router.put('/:BuyerId/:ProductId', controller.updateOffer);
router.delete('/:BuyerId', controller.deleteBuyerOffers);
router.delete('/:BuyerId/:ProductId', controller.deleteOffer);

// get all products of the buyer
//router.get('/:id/products', controller.getProducts)

export { router as offers };