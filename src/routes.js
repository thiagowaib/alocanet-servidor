// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()

// * Definição dos Endpoints
// ControllerAdmin Endpoints
const {novoAdmin, loginAdmin, updateAdminById, removeAdminById} = require('./controllers')
const {AuthTokenAcesso} = require('./middlewares')
routes.post('/novoAdmin', novoAdmin)
routes.post('/loginAdmin', loginAdmin)
routes.put('/updateAdmin/:id', updateAdminById)
routes.delete('/removeAdmin/:id', removeAdminById)
routes.get('/testAuth', AuthTokenAcesso, (req, res)=>{
    res.status(200).send({
        message:"JWT Validado",
        admin: req.payload.usuario
    })
})
// * Exportação das rotas para main.js
module.exports = routes