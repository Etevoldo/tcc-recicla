'use strict'

import express from 'express'
import { authenticate, requireAdmin } from '../middleware/auth.mjs'
import * as controller from '../controller/usersController.mjs'

const router = express.Router()

router.use(authenticate, requireAdmin)
router.get('/', controller.retrieveUsers)
router.post('/', controller.createUser)
router.put('/:id', controller.updateUser)
router.delete('/:id', controller.deleteUser)

export { router as users }
