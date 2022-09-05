// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    data: {
        type: Date,
        default: null
    },
    apartamentoId: {
        type: String,
        default: ""
    },
    apartamento: {
        type: Number,
        default: 0
    },
    espacoId: {
        type: String,
        default: ""
    },
    espaco: {
        type: String,
        default: ""
    },
    valor: {
        type: Number,
        defaut: 0
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Cancelamentos', schema, 'cancelamentos')