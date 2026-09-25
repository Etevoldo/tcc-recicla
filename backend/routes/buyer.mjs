'use strict'

import express from "express"
import * as controller from "../controller/buyersController.mjs"

const router = express.Router();


// basic crud
router.get('/:id', controller.retrieveBuyer);
router.post('/', controller.createBuyer);
router.put('/:id', controller.updateBuyer);
router.delete('/', controller.deleteBuyer);

router.get('/nearby:cep', findNearby)
// get all products of the buyer
//router.get('/:id/products', controller.getProducts)

//TODO implement find algorithm
function findNearby(req, res) {
    return;
}

export { router as buyers };