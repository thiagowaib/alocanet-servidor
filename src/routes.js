// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()

// * Definição dos Endpoints
/* 
const {myMethod} = require('./controllers/example-controller')
routes.get('/getExample/:id', myMethod) 
*/


// * Exportação das rotas para main.js
module.exports = routes