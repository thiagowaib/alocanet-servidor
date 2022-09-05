// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()


// * Importação de Middlewares
const {AuthTokenAcesso} = require('./middlewares')


// * Definição dos Endpoints
// ControllerAdmin Endpoints
const {novoAdmin, loginAdmin, updateAdminById, removeAdminById} = require('./controllers')
routes.post('/novoAdmin', novoAdmin)
routes.post('/loginAdmin', loginAdmin)
routes.put('/updateAdmin/:id', updateAdminById)
routes.delete('/removeAdmin/:id', removeAdminById)

// ControllerApartamentos Endpoits
const {novoApto, loginApto, modificarSenha, removerApto, consultarApto} = require('./controllers')
routes.post('/novoApto', AuthTokenAcesso, novoApto)
routes.post('/loginApto', loginApto)
routes.put('/modificarSenha', AuthTokenAcesso, modificarSenha)
routes.get('/consultarApto/:numero', AuthTokenAcesso, consultarApto) //! Não Finalizado
routes.delete('/removerApto/:numero', AuthTokenAcesso, removerApto)
// routes.put('/addLocacao/:numero', AuthTokenAcesso, addLocacao)
// routes.put('/cancelarLocacao/:numero', AuthTokenAcesso, cancelarLocacao) //! Não Finalizado

// * Exportação das rotas para main.js
module.exports = routes