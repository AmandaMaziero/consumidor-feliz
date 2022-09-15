const transporter = require('../config/transporter')
const generateCode = require('../utils/generateCode')
const generateToken = require('../utils/generateToken')
const db = require('../models')
const bcrypt = require('bcrypt')

class AuthController {
    static async login(request, response) {
        try {
            const { email, password, type } = request.body

            let model

            if (!email || !password || !type) return response.status(400).json({ message: 'Campos incompletos, verifique seu envio!' })

            if (type === 1) {
                model = db.User
            } else if (type === 2) {
                model = db.Store
            } else {
                return response.status(401).json({ message: 'Tipo inválido e não conhecido pelo sistema!' })
            }

            const user = await model.findOne({ where: { email: email } })
            if (!user) return response.status(404).json({ message: 'Usuário não encontrado no sistema!' })

            if (!await bcrypt.compare(password, user.password)) return response.status(401).json({ message: 'Senha não corresponde!' })

            user.password = undefined

            return response.status(200).json({ user, token: generateToken({ id: user.id }) })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async recoverPassword(request, response) {
        try {
            const { email, type } = request.body
            let model, code

            if (!type) return response.status(412).json({ message: 'É necessário informar o tipo para prosseguir!' })

            if (type === 1) {
                model = db.User
            } else if (type === 2) {
                model = db.Store
            } else {
                return response.status(401).json({ message: 'Tipo inválido e não conhecido pelo sistema!' })
            }

            const checkEmail = await model.findOne({ where: { email: email } })
            if (!checkEmail) return response.status(404).json({ message: 'O email informado não corresponde a nenhum usuário!' })

            //checa se já existe uma solicitação de recuperação de senha com o email informado
            const checkStatus = await db.PasswordRecovery.findOne({ where: [{ email: email }, { status: 1 }] })
            //se existir ele atribui status 0 a ela para assim valer somente a que será criada.
            if (checkStatus) {
                await checkStatus.update({
                    status: 0
                })
            }

            code = generateCode()

            await checkEmail.update({
                code
            })

            const mail = await transporter.sendMail({
                from: 'Consumidor Feliz<consumidorfeliz@gmail.com>',
                to: `${checkEmail.email}`,
                subject: "Recuperação de senha",
                html: `<center><h1>Segue o código de recuperação da sua conta: ${code}</h1> <h2>Acesse o link: e insira o código informado.</h2><h3>Agora é só você alterar sua senha!</h3><p>Abraços, Equipe Consumidor Feliz!</p></center>`
            })

            if (!mail) {
                return response.status(400).json({ message: 'Não foi possível enviar o email!' })
            }

            return response.status(201).json({ message: 'Solicitação de recuperação de senha cadastrada com sucesso!', passwordRecovery })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async changePassword(request, response) {
        try {
            const { id } = request.params
            const { password, code, type } = request.body

            if (!type, password, code) return response.status(400).json({ message: 'Campos incompletos, verifique seu envio!' })

            let model
            if (type === 1) {
                model = db.User
            } else if (type === 2) {
                model = db.Store
            } else {
                return response.status(401).json({ message: 'Tipo inválido e não conhecido pelo sistema!' })
            }

            const user = await model.findOne({ where: { id: Number(id) } })
            if (!user) return response.status(404).json({ message: `Não foi encontrado usuário com id ${id}` })

            if (code != user.code) return response.status(401).json({ message: 'Códigos não correspondem!' })

            const regex = /^(?=.*[@!#$%^&*()/\\])[@!#$%^&*()/\\a-zA-Z0-9]{8,16}$/

            if (!regex.test(password)) response.status(406).json({ message: 'As senhas devem ter entre 8 a 16 caracteres, sendo um deles especial e numérico!' })

            const hash = await bcrypt.hash(password, 12)

            await checkEmail.update({
                password: hash,
                code: null
            }, { transaction: t })

            return response.status(200).json({ message: 'Senha atualizada com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }
}

module.exports = AuthController