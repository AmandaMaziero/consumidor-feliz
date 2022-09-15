const jwt = require('jsonwebtoken')
const secret = process.env.SECRET

function generateToken(params = {}) {
    return jwt.sign(params, secret, { expiresIn: 36000 })
}

module.exports = generateToken