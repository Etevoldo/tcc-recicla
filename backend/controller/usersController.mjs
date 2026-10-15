'use strict'

import bcrypt from 'bcryptjs'
import { db } from '../models/init_models.mjs'
import { publicUser } from '../middleware/auth.mjs'

const User = db.user
const Buyer = db.buyer

function withBuyer(user) {
    const payload = publicUser(user)
    payload.buyerName = user.Buyer?.name ?? null
    return payload
}

async function countAdmins() {
    return User.count({ where: { role: 'ADMIN' } })
}

async function loadUser(id) {
    return User.findByPk(id, {
        include: [{ model: Buyer, attributes: ['id', 'name'] }],
    })
}

export async function retrieveUsers(req, res) {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['passwordHash', 'createdAt', 'updatedAt'] },
            include: [{ model: Buyer, attributes: ['id', 'name'] }],
            order: [['id', 'ASC']],
        })
        return res.status(200).json(users.map(withBuyer))
    } catch (error) {
        console.error(error)
        return res.status(404).json({ message: 'Usuários não encontrados' })
    }
}

export async function createUser(req, res) {
    try {
        const name = String(req.body?.name || '').trim()
        const email = String(req.body?.email || '').trim().toLowerCase()
        const password = String(req.body?.password || '')
        const role = req.body?.role

        if (!name || !email || password.length < 6) {
            return res.status(400).json({ message: 'Informe nome, e-mail e senha com no mínimo 6 caracteres' })
        }
        if (role !== 'ADMIN' && role !== 'BUYER') {
            return res.status(400).json({ message: 'Papel inválido' })
        }

        const existing = await User.findOne({ where: { email } })
        if (existing !== null) {
            return res.status(400).json({ message: 'E-mail já cadastrado' })
        }

        let buyerId = null
        if (role === 'BUYER') {
            const buyer = await Buyer.create({ name, email })
            buyerId = buyer.id
        }

        const created = await User.create({
            name,
            email,
            passwordHash: await bcrypt.hash(password, 10),
            role,
            BuyerId: buyerId,
            mustChangePassword: true,
        })
        const user = await loadUser(created.id)
        return res.status(201).json(withBuyer(user))
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Não foi possível cadastrar o usuário' })
    }
}

export async function updateUser(req, res) {
    try {
        const id = Number(req.params.id)
        const user = await User.findByPk(id)
        if (user === null) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }

        const nextRole = req.body?.role
        if (nextRole !== 'ADMIN' && nextRole !== 'BUYER') {
            return res.status(400).json({ message: 'Papel inválido' })
        }
        if (id === req.user.id && nextRole !== user.role) {
            return res.status(400).json({ message: 'Não é permitido alterar o próprio papel' })
        }
        if (user.role === 'ADMIN' && nextRole !== 'ADMIN') {
            const admins = await countAdmins()
            if (admins <= 1) {
                return res.status(400).json({ message: 'Não é permitido rebaixar o último administrador' })
            }
        }

        let nextBuyerId = user.BuyerId
        if (nextRole === 'BUYER' && nextBuyerId == null) {
            const buyer = await Buyer.create({
                name: user.name,
                email: user.email,
            })
            nextBuyerId = buyer.id
        }

        await user.update({
            role: nextRole,
            BuyerId: nextBuyerId,
        })
        const refreshed = await loadUser(id)
        return res.status(200).json(withBuyer(refreshed))
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Não foi possível atualizar o usuário' })
    }
}

export async function deleteUser(req, res) {
    try {
        const id = Number(req.params.id)
        if (id === req.user.id) {
            return res.status(400).json({ message: 'Não é permitido excluir a si mesmo' })
        }

        const user = await User.findByPk(id)
        if (user === null) {
            return res.status(404).json({ message: 'Usuário não encontrado' })
        }
        if (user.role === 'ADMIN') {
            const admins = await countAdmins()
            if (admins <= 1) {
                return res.status(400).json({ message: 'Não é permitido excluir o último administrador' })
            }
        }

        const buyerId = user.BuyerId
        await user.destroy()
        if (buyerId != null) {
            await db.offer.destroy({ where: { BuyerId: buyerId } })
            await db.product.destroy({ where: { ownerId: buyerId } })
            await Buyer.destroy({ where: { id: buyerId } })
        }
        return res.status(204).send()
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Não foi possível excluir o usuário' })
    }
}
