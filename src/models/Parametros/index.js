// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    minDiasAlocar: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para minDiasAlocar"],
        min: [0, "minDiasAlocar precisa de um valor maior que 0"]
    },
    maxDiasAlocar: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para maxDiasAlocar"],
        min: [0, "maxDiasAlocar precisa de um valor maior que 0"]
    },
    minDiasCancelar: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para minDiasCancelar"],
        min: [0, " precisa de um valor maior que 0"]
    },
    maxDiasCancelar: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para maxDiasCancelar"],
        min: [0, "minDiasCancelar precisa de um valor maior que 0"]
    },
    limiteLocacoes: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para limiteLocacoes"],
        min: [0, "limiteLocacoes precisa de um valor maior que 0"]
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Parametros', schema, 'parametros')