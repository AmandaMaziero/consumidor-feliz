const { Router } = require('express')
const UserController = require('../controllers/UserController')
const auth = require('../middleware/auth')
const { upload } = require('../config/upload');
const multer = require('multer')

const uploadConfig = multer(upload('assets/users'))

const userRoutes = Router()

userRoutes.use(auth)
userRoutes.get('/', UserController.getUsers)
userRoutes.get('/:id', UserController.getUserById)
userRoutes.post('/register', UserController.register)
userRoutes.put('/update', UserController.update)
userRoutes.patch('/password/:id', UserController.changePassword)
userRoutes.patch('/image/:id', uploadConfig.single('image'), UserController.changeImage)
userRoutes.patch('/status/:id', UserController.changeStatus)
userRoutes.delete('/delete/:id', UserController.delete)

module.exports = userRoutes