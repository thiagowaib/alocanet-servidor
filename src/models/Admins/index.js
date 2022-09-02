// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    usuario: {
        type: String,
        default: ""
    },
    senha: {
        type: String,
        default: ""
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Admins', schema, 'admins')