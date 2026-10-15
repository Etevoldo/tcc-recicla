'use strict'

import express from "express"
import * as controller from "../controller/buyersController.mjs"
import { authenticate, requireAdmin, requireBuyerOwnerOrAdmin } from "../middleware/auth.mjs"

const router = express.Router();

router.get('/', controller.retrieveAllBuyers);
router.get('/:id/products', controller.retrieveBuyerProducts);
router.get('/:id', controller.retrieveBuyer);
router.post('/', authenticate, requireAdmin, controller.createBuyer);
router.put('/:id', authenticate, requireBuyerOwnerOrAdmin('id'), controller.updateBuyer);
router.delete('/:id', authenticate, requireAdmin, controller.deleteBuyer);

export { router as buyers };
