// * Importações
const ControllerAdmins = require('./ControllerAdmins')
const ControllerApartamentos = require('./ControllerApartamentos')
const ControllerCancelamentos = require('./ControllerCancelamentos')
const ControllerEspacos = require('./ControllerEspacos')
const ControllerLocacoes = require('./ControllerLocacoes')
const ControllerParametros = require('./ControllerParametros')


// * Exportação
module.exports = {
    ...ControllerAdmins,
    ...ControllerApartamentos,
    ...ControllerCancelamentos,
    ...ControllerEspacos,
    ...ControllerLocacoes,
    ...ControllerParametros
}