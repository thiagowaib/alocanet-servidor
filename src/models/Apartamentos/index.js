// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    numero: {
        type: Number,
        default: 0,
    },
    senha: {
        type: String,
        default: ""
    },
    locacoes: [{
        type: String,
        default: null
    }],
    cancelamentos: [{
        type: String,
        default: null
    }]
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Apartamentos', schema, 'apartamentos')