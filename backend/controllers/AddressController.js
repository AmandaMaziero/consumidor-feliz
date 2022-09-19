const db = require('../models')

class AddressController {
    static async getAddresses(request, response) {
        try {
            const page = request.query.page ? request.query.page : 1
            const limit = request.query.limit ? request.query.limit : 8

            let offset = 0
            const count = await db.Address.count()

            let pages = Math.ceil(quant / limit)
            offset = Number(limit) * (page - 1)

            const addresses = await db.User.findAll({
                limit: Number(limit),
                offset: Number(offset),
                $sort: { id: 1 }
            })

            return response.status(200).json({ addresses, pages, count })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async getAddressById(request, response) {
        try {
            const { id } = request.params

            const address = await db.Address.findOne({ where: { id: Number(id) } })
            if (!address) return response.status(404).json({ message: `Não foi encontrado endereço com id ${id}` })

            return response.status(200).json({ address })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async getAddressByUser(request, response) {
        try {
            const { iduser } = request.params

            const addresses = await db.Address.findAll({
                include: {
                    model: db.UserAddress, as: 'UserAddress',
                    where: { iduser: Number(iduser) },
                    require: true
                }
            })
            if (!addresses) return response.status(404).json({ message: `Não foi encontrado endereços com id usuário ${id}` })

            return response.status(200).json({ addresses })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async getAddressByStore(request, response) {
        try {
            const { idstore } = request.params

            const addresses = await db.Address.findAll({
                include: {
                    model: db.StoreAddress, as: 'StoreAddress',
                    where: { idstore: Number(idstore) },
                    require: true
                }
            })
            if (!addresses) return response.status(404).json({ message: `Não foi encontrado endereços com id loja ${idstore}` })

            return response.status(200).json({ addresses })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async register(request, response) {
        try {
            const { id } = request.params
            const { address, number, district, state, country, city, complement, cep, type } = request.body

            if (!address || !number || !district || !state || !country || !city || !cep || !type)
                return response.status(400).json({ message: 'Campos incompletos!' })

            let model, modelConnect

            if (type === 1) {
                model = db.User
            } else if (type === 2) {
                model = db.Store
            } else {
                return response.status(401).json({ message: 'Tipo enviado inválido!' })
            }

            const verifyIfExists = await model.findOne({ where: { id: Number(id) } })
            if (!verifyIfExists) return response.status(404).json({ message: `Não foi encontrado componente com id ${id}` })

            const result = await db.sequelize.transaction(async t => {
                const addressInsert = await db.Address.create({
                    address,
                    number,
                    district,
                    state,
                    country,
                    city,
                    complement,
                    cep,
                    type
                }, { transaction: t })

                if (type === 1) {
                    const addressConnect = await db.UserAddress.create({
                        idaddress: addressInsert.id,
                        iduser: id
                    }, { transaction: t })
                } else {
                    const addressConnect = await db.StoreAddress.create({
                        idaddress: addressInsert.id,
                        idstore: id
                    }, { transaction: t })
                }

                return addressInsert, addressConnect
            })

            return response.status(201).json({ message: 'Endereço cadastrado com sucesso!', result })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async update(request, response) {
        try {
            return response.status(200).json({ message: 'Endereço atualizado com sucesso!', addressUpdate })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async changeStatus(request, response) {
        try {
            return response.status(200).json({ message: 'Endereço teve o status atualizado com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }

    static async delete(request, response) {
        try {
            return response.status(200).json({ message: 'Endereço deletado com sucesso!' })
        } catch (error) {
            return response.status(500).json({ message: error.message })
        }
    }
}

module.exports = AddressController