'use strict'

import express from 'express'
import { authenticate } from '../middleware/auth.mjs'
import * as controller from '../controller/authController.mjs'

const router = express.Router()

router.post('/login', controller.login)
router.get('/me', authenticate, controller.me)
router.post('/change-password', authenticate, controller.changePassword)

export { router as auth }
