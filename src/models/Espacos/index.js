// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    nome: {
        type: String,
        default: "",
    },
    valorAtual: {
        type: Number,
        default: 0
    },
    ocupados: [{
        type: String,
        default: null
    }],
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Espacos', schema, 'espacos')