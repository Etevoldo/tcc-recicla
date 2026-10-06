'use strict'

import express from "express"
import * as controller from "../controller/addressesController.mjs"

const router = express.Router();

// basic crud
router.get('/:cep', controller.retrieveAddress);
router.get('/', controller.retrieveAllAddresses);
router.post('/', controller.createAddress);
router.delete('/', controller.deleteAddress);

router.get('/searchBuyers/:cep', controller.searchBuyers);
// get all products of the buyer
//router.get('/:id/products', controller.getProducts)

export { router as addresses };