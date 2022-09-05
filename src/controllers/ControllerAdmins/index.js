// * Importações
const {Admins} = require('../../models')
const jwt = require('jsonwebtoken')

// * Exportação dos métodos do Controller
module.exports = {

    // => Cria novo objeto Admin
    async novoAdmin(req, res){
        const {usuario, senha} = req.body

        const {HashPwd} = require('../../services')
        const hashedSenha = await HashPwd(senha)

        const novoAdmin = new Admins({
            usuario:usuario,
            senha: hashedSenha
        })

        novoAdmin.save((err)=>{
            if(err) return res.status(400).send({message: "Falha ao cadastrar", error: err})
            else return res.status(201).send({message: "Admin cadastrado"})
        })
    },

    // => Autentifica o usuário Admin, retorna tokenAcesso
    loginAdmin(req, res){
        const {usuario, senha} = req.body
        const {AuthPwd, SetExpDate} = require('../../services')

        Admins.findOne({usuario: usuario}, async(err, admin) => {
            // Confere se o admin foi cadastrado
            if(admin) {
                // Autentifica a Senha inserida
                if(await AuthPwd(admin.senha, senha)) {
                    // Dados inbutidos no JWT
                    const jwtPayload = {
                        usuario: admin.usuario,
                        exp: SetExpDate(Date.now(), 1, "h")
                    }

                    // Token de Acesso enviado ao usuário p/ autentificar
                    const tokenAcesso = jwt.sign(
                        jwtPayload,
                        process.env.JWT_ACCESS_TOKEN_SECRET
                    )
                    return res.status(202).send({message: "Login bem-sucedido", tokenAcesso})
                } else {
                    return res.status(401).send({message: "Senha Invalida"})
                }
            } else {
                return res.status(404).send({message: "Admin nao Cadastrado"})
            }
        })
    },

    // => Recebe o ID de um admin via Params e o modifica de acordo com o body
    updateAdminById(req, res){
        const queryId = req.params.id

        Admins.findById(queryId, async (err, admin)=>{
            if(err) return res.status(400).send({message: "ID Invalido", error: err})
            
            if(admin) {
                const {usuario, senha} = req.body
                const {HashPwd} = require('../../services')

                if(usuario!=="" && usuario) admin.usuario = usuario
                if(senha!=="" && senha) admin.senha = await HashPwd(senha)
    
                admin.save((err)=>{
                    if(err) return res.status(400).send({message: "Falha ao salvar alteracoes", error: err})
                else return res.status(202).send({message: "Alteracoes Salvas"})
                })
    
            } else {
                return res.status(404).send({message: "Admin nao Encontrado"})
            }
        })
    },

    // => Recebe o ID de um admin via Params e remove-o
    removeAdminById(req, res){
        const removeId = req.params.id

        Admins.findByIdAndRemove(removeId, (err, admin)=>{
            console.log(admin)
            if(err) return res.status(400).send({message: "Erro ao Remover Admin", error: err})
            else if(admin===null) return res.status(400).send({message: "ID Invalido"})
            else return res.status(200).send({message: "Admin Removido"})
        })
    } 
}