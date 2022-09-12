// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    data: {
        type: String,
        default: "",
        required: [true, "Necessário uma data para a Locação"]
    },
    apartamentoId: {
        type: String,
        default: "",
        required: [true, "Necessário um _id de apartamento para a Locação"]
    },
    apartamento: {
        type: Number,
        default: 0,
        required: [true, "Necessário um número de apartamento para a Locação"],
        min: [0, "O número do apartamento precisa ser maior que 0"]
    },
    espacoId: {
        type: String,
        default: "",
        required: [true, "Necessário um _id de espaço para a Locação"]
    },
    espaco: {
        type: String,
        default: "",
        required: [true, "Necessário um nome de espaço para a Locação"]
    },
    valor: {
        type: Number,
        defaut: 0,
        required: [true, "Necessário um valor para a Locação"],
        min: [0, "O valor da locação precisa ser maior que 0"]
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Locacoes', schema, 'locacoes')