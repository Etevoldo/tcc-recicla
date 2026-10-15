'use strict'

import express from "express"
import * as controller from "../controller/produtsController.mjs"
import { authenticate, requireBuyer, requireProductOwnerOrAdmin } from "../middleware/auth.mjs"

const router = express.Router();

router.get('/:id', controller.retrieveProduct);
router.get('/', controller.retrieveProducts);
router.post('/', authenticate, requireBuyer, controller.createProduct);
router.put('/:id', authenticate, requireProductOwnerOrAdmin, controller.updateProduct);
router.delete('/:id', authenticate, requireProductOwnerOrAdmin, controller.deleteProduct);

export { router as products };
