// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    minDiasAlocar: {
        type: Number,
        default: 0
    },
    maxDiasAlocar: {
        type: Number,
        default: 0
    },
    minDiasCancelar: {
        type: Number,
        default: 0
    },
    maxDiasCancelar: {
        type: Number,
        default: 0
    },
    limiteLocacoes: {
        type: Number,
        default: 0
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Parametros', schema, 'parametros')