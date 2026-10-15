'use strict'

import express from "express"
import * as controller from "../controller/offersController.mjs"
import { authenticate, requireAdmin, requireBuyerOwnerOrAdmin } from "../middleware/auth.mjs"

const router = express.Router();

router.get('/buyer/:BuyerId', controller.retrieveOffersByBuyer);
router.get('/product/:ProductId', controller.retrieveOffersByProduct);
router.get('/:BuyerId/:ProductId', controller.retrieveOffer);
router.get('/', controller.retrieveOffers);

router.post('/', authenticate, requireBuyerOwnerOrAdmin('buyerId'), controller.createOffer);
router.put('/:BuyerId/:ProductId', authenticate, requireBuyerOwnerOrAdmin('BuyerId'), controller.updateOffer);
router.delete('/:BuyerId/:ProductId', authenticate, requireBuyerOwnerOrAdmin('BuyerId'), controller.deleteOffer);
router.delete('/:BuyerId', authenticate, requireAdmin, controller.deleteBuyerOffers);

export { router as offers };
