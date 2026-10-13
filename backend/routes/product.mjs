'use strict'

import express from "express"
import * as controller from "../controller/produtsController.mjs"

const router = express.Router();

router.get('/:id', controller.retrieveProduct);
router.get('/', controller.retrieveProducts);
router.post('/', controller.createProduct);
router.put('/:id', controller.updateProduct);
router.delete('/:id', controller.deleteProduct);


export { router as products };