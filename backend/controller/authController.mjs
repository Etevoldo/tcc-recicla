'use strict'

import bcrypt from 'bcryptjs'
import { db } from '../models/init_models.mjs'
import { publicUser, signToken } from '../middleware/auth.mjs'

const User = db.user

export async function login(req, res) {
    try {
        const email = String(req.body?.email || '').trim().toLowerCase()
        const password = String(req.body?.password || '')
        if (!email || !password) {
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        const user = await User.findOne({ where: { email } })
        if (user === null) {
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        const matches = await bcrypt.compare(password, user.passwordHash)
        if (!matches) {
            return res.status(401).json({ message: 'Credenciais inválidas' })
        }

        return res.status(200).json({
            token: signToken(user),
            user: publicUser(user),
        })
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'Credenciais inválidas' })
    }
}

export async function me(req, res) {
    try {
        const user = await User.findByPk(req.user.id)
        if (user === null) {
            return res.status(401).json({ message: 'Não autenticado' })
        }
        return res.status(200).json(publicUser(user))
    } catch (error) {
        console.error(error)
        return res.status(401).json({ message: 'Não autenticado' })
    }
}

export async function changePassword(req, res) {
    try {
        const currentPassword = String(req.body?.currentPassword || '')
        const newPassword = String(req.body?.newPassword || '')
        if (!currentPassword || newPassword.length < 6) {
            return res.status(400).json({ message: 'Informe a senha atual e uma nova senha com no mínimo 6 caracteres' })
        }

        const user = await User.findByPk(req.user.id)
        if (user === null) {
            return res.status(401).json({ message: 'Não autenticado' })
        }

        const matches = await bcrypt.compare(currentPassword, user.passwordHash)
        if (!matches) {
            return res.status(400).json({ message: 'Senha atual incorreta' })
        }

        await user.update({
            passwordHash: await bcrypt.hash(newPassword, 10),
            mustChangePassword: false,
        })
        return res.status(200).json(publicUser(user))
    } catch (error) {
        console.error(error)
        return res.status(400).json({ message: 'Não foi possível alterar a senha' })
    }
}
