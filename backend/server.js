const express = require('express')
const cors = require('cors')
const path = require('path')
const db = require('./models')
const port = process.env.PORT || 7000

require ('dotenv').config()

const app = express()

app.use(cors())
app.use(express.json())
app.use('/assets', express.static(path.join(__dirname, './assets')))

// routes
app.get('/', (request, response) => {
    response.status(200).json({ message: "Servidor rodando" })
})

const authRoutes = require('./routes/auth.routes')
app.use('/', authRoutes)


const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.includes(origin) || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Origin not allowed by CORS'));
        }
    }
}

app.options('', cors(corsOptions));

app.use(cors());

app.listen(port, async() => {
    try {
        await db.sequelize.authenticate()
        console.log('Sucesso na conexão');
        console.log(`Rodando na porta ${port}`)
    } catch (error) {
        console.log(`Error: ${error.message}`);
    }
})
