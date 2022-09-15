const { Router } = require('express')
const AuthController = require('../controllers/AuthController')

const authRoutes = Router()

authRoutes.post('/login', AuthController.login)
authRoutes.post('/recoverPass', AuthController.recoverPassword)
authRoutes.put('/changePass/:id', AuthController.changePassword)

module.exports = authRoutes