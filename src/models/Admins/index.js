// * Importações das bibliotecas
const mongoose = require('mongoose')


// * Definição do Schema
const schema = new mongoose.Schema({
    usuario: {
        type: String,
        default: "",
        unique: true,
        required: [true, "Necessário um nome de usuário para o Admin"],
    },
    senha: {
        type: String,
        default: "",
        required: [true, "Necessário uma senha para o Admin"],
    }
}, {timestamps: true})


// * Exportação do Modelo
module.exports = mongoose.model('Admins', schema, 'admins')