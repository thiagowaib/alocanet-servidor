// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    numero: {
        type: Number,
        default: 0,
        unique: true,
        required: [true, "Necessário um número de apartamento"],
        min: [0, "O número do apartamento precisa ser maior que 0"]
    },
    senha: {
        type: String,
        default: "",
        required: [true, "Neccessário uma senha para o apartamento"],
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