const db = require("../models")
const PORT = process.env.PORT
const BASE_URL = process.env.BASE_URL
const path = `${BASE_URL}:${PORT}/users/`

class UserController {
    static async getUsers(request, response) {
        try {
            const page = request.query.page ? request.query.page : 1
            const limit = request.query.limit ? request.query.limit : 8

            let offset = 0
            const count = await db.User.count()

            let pages = Math.ceil(quant / limit)
            offset = Number(limit) * (page - 1)

            const users = await db.User.findAll({
                limit: Number(limit),
                offset: Number(offset),
                $sort: { id: 1 }
            })

            return response.status(200).json({ users, pages, count })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async getUserById(request, response) {
        try {
            const { id } = request.params

            const user = await db.User.findOne({ where: { id: Number(id) } })
            return response.status(200).json({ user })
        } catch (error) {
            return response.status(200).json({ message: error.message })
        }
    }

    static async register(request, response) {
        try {
            const { name, email, password, confirmPassword, birthDate, cpf, cell, telephone, gender, type } = request.body

            if (!name || !email || !password || !confirmPassword || !birthDate || !cpf || !cell || !gender || !type)
                return response.status(400).json({ message: 'Campos incompletos, verifique seu envio!' })

            if (password != confirmPassword) return response.status(401).json({ message: 'Senhas não correspondem!' })

            const verifiyEmail = await db.User.findOne({ where: { email: email } })
            if (verifiyEmail) return response.status(401).json({ message: 'Email já utilizado!' })

            const verifyCpf = await db.User.findOne({ where: { cpf: cpf } })
            if (verifyCpf) return response.status(401).json({ message: 'Cpf já utilizado!' })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,16}$/

            if (!regex.test(password)) response.status(406).json({ message: 'As senhas devem ter entre 8 a 16 caracteres, sendo um deles especial e numérico!' })

            const hash = await bcrypt.hash(password, 12)

            const user = await db.User.create({
                name,
                email,
                password: hash,
                birthDate,
                cpf,
                cell,
                telephone,
                gender,
                type
            })

            return response.status(201).json({ message: 'Usuário cadastrado com sucesso!', user })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async update(request, response) {
        try {
            const { id } = request.params
            const { name, email, birthDate, cell, telephone, gender } = request.body

            const user = await db.User.findOne({ where: { id: Number(id) } })
            if (!user) return response.status(404).json({ message: `Não foi encontrado usuário com id ${id}!` })

            const verifiyEmail = await db.User.findOne({ where: { email: email } })
            if (verifiyEmail) return response.status(401).json({ message: 'Email já utilizado!' })

            await user.update({
                name,
                email,
                birthDate,
                cell,
                telephone,
                gender
            })

            return response.status(200).json({ message: 'Usuário atualizado com sucesso!', user })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async changeStatus(request, response) {
        try {
            const { id } = request.params

            const user = await db.User.findOne({ where: { id: Number(id) } })
            if (!user) return response.status(404).json({ message: `Não foi encontrado usuário com id ${id}!` })

            const { status } = user

            await user.update({
                status: !status
            })
            return response.status(200).json({ message: 'Usuário teve o status atualizado com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async changeImage(request, response) {
        try {
            const { id } = request.params
            const image = request.file

            if (!image) return response.status(400).json({ message: 'Imagem ausente ou não anexada!' })

            const user = await db.User.findOne({ where: { id: Number(id) } })
            if (!user) return response.status(404).json({ message: `Não foi encontrado usuário com id ${id}!` })

            await user.update({
                image: filename ? path + image.filename : user.image
            })
            return response.status(200).json({ message: 'Usuário teve a foto de perfil atualizada com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async changePassword(request, response) {
        try {
            const { id } = request.params
            const { password, confirmPassword } = request.body

            if (!password || !confirmPassword) return response.status(400).json({ message: 'Campos incompletos, verifique seu envio!' })

            if (password != confirmPassword) return response.status(401).json({ message: 'Senhas não correspondem!' })

            const user = await db.User.findOne({ where: { id: Number(id) } })
            if (!user) return response.status(404).json({ message: `Não foi encontrado usuário com id ${id}!` })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,16}$/

            if (!regex.test(password)) response.status(406).json({ message: 'As senhas devem ter entre 8 a 16 caracteres, sendo um deles especial e numérico!' })

            const hash = await bcrypt.hash(password, 12)

            await user.update({
                password: hash
            })
            return response.status(200).json({ message: 'Usuário teve a senha atualizada com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async delete(request, response) {
        try {
            return response.status(200).json({ message: 'Usuário deletado com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }
}

module.exports = UserController