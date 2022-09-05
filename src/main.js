// * Importações das bibliotecas
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')


// * Configuração para o uso do arquivo de ambiente (.env)
require('dotenv').config()


// * Função de inicialização do servidor
const initServidor = () => {

    const app = express()

    // Conexão com o BD
    mongoose.connect(process.env.DB_URI, {
        useNewUrlParser: true,
    })

    app.use(express.json())
    app.use(cors())

    // Conexão com os endpoints em ./routes.js
    app.use(require('./routes'))

    // Inicialização do servidor na porta {SERVER_PORT}
    // Com feedback de confirmação
    const servidor = require('http').Server(app)
    servidor.listen(process.env.SERVER_PORT || 5000, () => {
        console.log(`Servidor AlocaNet online em ${process.env.SERVER_URL}:${process.env.SERVER_PORT}/`)
    })
}


// * Inicialização do servidor
initServidor()