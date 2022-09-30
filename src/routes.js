// * Importações das bibliotecas
const express = require('express')
const routes = new express.Router()


// * Importação de Middlewares
/**
 * O AuthTokenAcesso é um Middleware
 * (executado entre chamada e controlador)
 * que verifica a autenticidade do Token de Acesso JWT
 * informado no header "auth".
 */
const {AuthTokenAcesso} = require('./middlewares')


// * Definição dos Endpoints
/**
 * Rotas dos métodos criados
 * no controlador referente aos Admins
 * ~ControllerAdmins
 */
const {novoAdmin, loginAdmin, modificarAdminById, removeAdminById} = require('./controllers')
routes.post('/novoAdmin', novoAdmin)
routes.post('/loginAdmin', loginAdmin)
routes.put('/modificarAdmin/:id', modificarAdminById)
routes.delete('/removeAdmin/:id', removeAdminById)

/**
 * Rotas dos métodos criados
 * no controlador referente aos Apartamentos
 * ~ControllerApartamentos
 */
const {novoApto, loginApto, modificarSenha, removerApto, consultarApto} = require('./controllers')
routes.post('/novoApto', AuthTokenAcesso, novoApto)
routes.post('/loginApto', loginApto)
routes.put('/modificarSenha', AuthTokenAcesso, modificarSenha)
routes.get('/consultarApto/:numero', AuthTokenAcesso, consultarApto)
routes.delete('/removerApto/:numero', AuthTokenAcesso, removerApto)

/**
 * Rotas dos métodos criados
 * no controlador referente aos Espaços
 * ~ControllerEspacos
 */
const {novoEspaco, buscarEspacos, modificarEspacoById, removerEspacoById} = require('./controllers')
routes.post('/novoEspaco', AuthTokenAcesso, novoEspaco)
routes.get('/buscarEspacos', AuthTokenAcesso, buscarEspacos)
routes.put('/modificarEspaco/:id', AuthTokenAcesso, modificarEspacoById)
routes.delete('/removerEspaco/:id', AuthTokenAcesso, removerEspacoById)

/**
 * Rotas dos métodos criados
 * no controlador referente as Locações
 * ~ControllerLocacoes
 */
const {alocar} = require('./controllers')
routes.post('/alocar', AuthTokenAcesso, alocar)

/**
 * Rotas dos métodos criados
 * no controlador referente aos Cancelamentos
 * ~ControllerCancelamentos
 */
const {cancelarById, removerCancelamentoById} = require('./controllers')
routes.put('/cancelar/:id', AuthTokenAcesso, cancelarById)
routes.delete('/removerCancelamento/:id', removerCancelamentoById)

/**
 * Rotas dos métodos criados
 * no controlador referente aos Parâmetros
 * ~ControllerParametros
 */
const {initParametros, buscarParametros, modificarParametro} = require('./controllers')
routes.get('/initParametros', initParametros)
routes.get('/buscarParametros', AuthTokenAcesso, buscarParametros)
routes.put('/modificarParametro/:tag/:value', AuthTokenAcesso, modificarParametro)

/**
 * Rotas dos métodos criados
 * no controlador referente aos usuários
 * (Generalização [Admins|Apartamentos])
 * ~ControllerUsuarios
 */
const {authJWT, buscarDatas, buscarDetalhes} = require('./controllers')
routes.get('/authJWT', AuthTokenAcesso, authJWT)
routes.get('/buscarDatas', AuthTokenAcesso, buscarDatas)
routes.get('/buscarDatas', AuthTokenAcesso, buscarDatas)
routes.post('/buscarDetalhes', AuthTokenAcesso, buscarDetalhes)

// * Exportação das rotas para main.js
module.exports = routes