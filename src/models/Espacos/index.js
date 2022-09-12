// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    nome: {
        type: String,
        default: "",
        required: [true, "Necessário um nome para o espaço"],
        unique: true,
    },
    valorAtual: {
        type: Number,
        default: 0,
        required: [true, "Necessário um valor para o espaço"],
        min: [0, "O valor precisa ser maior que 0"]
    },
    ocupados: [{
        type: String,
        default: null
    }],
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Espacos', schema, 'espacos')