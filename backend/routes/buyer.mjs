'use strict'

import express from "express"
import * as controller from "../controller/buyersController.mjs"

const router = express.Router();


// basic crud
router.get('/', controller.retrieveAllBuyers);
router.get('/:id/products', controller.retrieveBuyerProducts);
router.get('/:id', controller.retrieveBuyer);
router.post('/', controller.createBuyer);
router.put('/:id', controller.updateBuyer);
router.delete('/', controller.deleteBuyer);


export { router as buyers };