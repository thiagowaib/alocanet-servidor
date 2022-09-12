// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    data: {
        type: String,
        default: "",
        required: [true, "Necessário uma data para o cancelamento"]
    },
    apartamentoId: {
        type: String,
        default: "",
        required: [true, "Necessário um _id de apartamento para o cancelamento"]
    },
    apartamento: {
        type: Number,
        default: 0,
        required: [true, "Necessário um número de apartamento para o cancelamento"],
        min: [0, "O número do apartamento precisa ser maior que 0"]
    },
    espacoId: {
        type: String,
        default: "",
        required: [true, "Necessário um _id de espaço para o cancelamento"]
    },
    espaco: {
        type: String,
        default: "",
        required: [true, "Necessário um nome de espaço para o cancelamento"]
    },
    valor: {
        type: Number,
        defaut: 0,
        required: [true, "Necessário um valor para o cancelamento"],
        min: [0, "O valor do cancelamento precisa ser maior que 0"]
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Cancelamentos', schema, 'cancelamentos')