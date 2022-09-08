// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()


// * Importação de Middlewares
const {AuthTokenAcesso} = require('./middlewares')


// * Definição dos Endpoints
// ControllerAdmin Endpoints
const {novoAdmin, loginAdmin, modificarAdminById, removeAdminById} = require('./controllers')
routes.post('/novoAdmin', novoAdmin)
routes.post('/loginAdmin', loginAdmin)
routes.put('/modificarAdmin/:id', modificarAdminById)
routes.delete('/removeAdmin/:id', removeAdminById)

// ControllerApartamentos Endpoints
const {novoApto, loginApto, modificarSenha, removerApto, consultarApto} = require('./controllers')
routes.post('/novoApto', AuthTokenAcesso, novoApto)
routes.post('/loginApto', loginApto)
routes.put('/modificarSenha', AuthTokenAcesso, modificarSenha)
routes.get('/consultarApto/:numero', AuthTokenAcesso, consultarApto) //! Não Finalizado
routes.delete('/removerApto/:numero', AuthTokenAcesso, removerApto)
// routes.put('/addLocacao/:numero', AuthTokenAcesso, addLocacao)
// routes.put('/cancelarLocacao/:numero', AuthTokenAcesso, cancelarLocacao) //! Não Finalizado

// ControllerEspacos Endpoints
const {novoEspaco, buscarEspacos, modificarEspacoById, removerEspacoById} = require('./controllers')
routes.post('/novoEspaco', AuthTokenAcesso, novoEspaco)
routes.get('/buscarEspacos', AuthTokenAcesso, buscarEspacos)
routes.put('/modificarEspaco/:id', AuthTokenAcesso, modificarEspacoById)
routes.delete('/removerEspaco/:id', AuthTokenAcesso, removerEspacoById)

// ControllerParametros Endpoints
const {initParametros, buscarParametros, modificarParametro} = require('./controllers')
routes.get('/initParametros', initParametros)
routes.get('/buscarParametros', AuthTokenAcesso, buscarParametros)
routes.put('/modificarParametro/:tag/:value', AuthTokenAcesso, modificarParametro)

// * Exportação das rotas para main.js
module.exports = routes