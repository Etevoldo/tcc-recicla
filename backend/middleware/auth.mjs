'use strict'

import jwt from 'jsonwebtoken'
import { db } from '../models/init_models.mjs'

function jwtSecret() {
    return process.env.JWT_SECRET || 'dev-secret-recicla'
}

export function signToken(user) {
    return jwt.sign(
        { id: user.id, role: user.role, buyerId: user.BuyerId ?? null },
        jwtSecret(),
        { expiresIn: process.env.JWT_EXPIRES_IN || '8h' }
    )
}

export function publicUser(user) {
    return {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        buyerId: user.BuyerId ?? null,
        mustChangePassword: Boolean(user.mustChangePassword),
    }
}

export function requireBuyer(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' })
    }
    if (req.user.role !== 'BUYER' || req.user.buyerId == null) {
        return res.status(403).json({ message: 'Acesso negado' })
    }
    return next()
}

export function authenticate(req, res, next) {
    const header = req.headers.authorization || ''
    const [scheme, token] = header.split(' ')
    if (scheme !== 'Bearer' || !token) {
        return res.status(401).json({ message: 'Não autenticado' })
    }
    try {
        const payload = jwt.verify(token, jwtSecret())
        req.user = {
            id: payload.id,
            role: payload.role,
            buyerId: payload.buyerId ?? null,
        }
        return next()
    } catch {
        return res.status(401).json({ message: 'Não autenticado' })
    }
}

export function requireAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' })
    }
    if (req.user.role !== 'ADMIN') {
        return res.status(403).json({ message: 'Acesso negado' })
    }
    return next()
}

export function requireBuyerOwnerOrAdmin(key) {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: 'Não autenticado' })
        }
        if (req.user.role === 'ADMIN') return next()
        const raw = req.params[key] ?? req.body[key]
        const buyerId = Number(raw)
        if (req.user.buyerId != null && Number(req.user.buyerId) === buyerId) {
            return next()
        }
        return res.status(403).json({ message: 'Acesso negado' })
    }
}

export async function requireProductOwnerOrAdmin(req, res, next) {
    if (!req.user) {
        return res.status(401).json({ message: 'Não autenticado' })
    }
    try {
        const product = await db.product.findByPk(req.params.id)
        if (product === null) {
            return res.status(404).json({ message: 'Produto não encontrado' })
        }
        if (req.user.role === 'ADMIN' || Number(req.user.buyerId) === Number(product.ownerId)) {
            req.product = product
            return next()
        }
        return res.status(403).json({ message: 'Acesso negado' })
    } catch (error) {
        console.error(error)
        return res.status(404).json({ message: 'Produto não encontrado' })
    }
}
