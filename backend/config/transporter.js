const nodemailer = require('nodemailer')
const pass = process.env.PASS

const transporter = nodemailer.createTransport({
    host: "smtp.hostinger.com",
    port: 465,
    secure: true,
    auth: {
        user: "consumidorfeliz@gmail.com",
        pass: pass
    }
})

module.exports = transporter