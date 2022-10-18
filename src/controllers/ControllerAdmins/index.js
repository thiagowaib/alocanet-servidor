// * Importações
const {Admins} = require('../../models')
const jwt = require('jsonwebtoken')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {post} /novoAdmin Criar novo objeto Admin
     * @apiName novoAdmin
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiBody {String} usuario Nome de usuário para o admin
     * @apiBody {String} senha Senha para o admin  
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Admin cadastrado"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Admin já existente"
     * }
     */
    novoAdmin(req, res){
        const {usuario, senha} = req.body

        Admins.findOne({usuario: usuario}, async(err, admin) => {
            if(admin) return res.status(400).send({message: "Admin já existente"})

            // Processo de criptografia da senha
            const {HashPwd} = require('../../services')
            const hashedSenha = await HashPwd(senha)

            // Criação do novo objeto
            const novoAdmin = new Admins({
                usuario:usuario,
                senha: hashedSenha
            })
    
            // Salvamento do novo objeto
            novoAdmin.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao cadastrar", error: err})
                else return res.status(201).send({message: "Admin cadastrado"})
            })
            
        })
    },

    /**
     * @api {post} /loginAdmin Logar Admin
     * @apiName loginAdmin
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiBody {String} usuario Usuário do admin
     * @apiBody {String} senha Senha do admin  
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Login bem-sucedido"
     *  tokenAcesso: [Token de Acesso JWT]
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Senha invalida"
     * }
     */
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
                        belongsTo: "Admins",
                        exp: SetExpDate(Date.now(), 1, "d")
                    }

                    // Token de Acesso enviado ao usuário p/ autentificar
                    const tokenAcesso = jwt.sign(
                        jwtPayload,
                        process.env.JWT_ACCESS_TOKEN_SECRET
                    )
                    return res.status(202).send({message: "Login bem-sucedido", tokenAcesso})
                } else {
                    return res.status(401).send({message: "Senha invalida"})
                }
            } else {
                return res.status(404).send({message: "Admin não cadastrado"})
            }
        })
    },

    /**
     * @api {put} /modificarAdmin/:id Modificar Admin via ID
     * @apiName modificarAdminById
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiParam {String} id ObjectId (_id) do Admin
     * 
     * @apiBody {String} [usuario="Usuário antigo"] Usuário do admin
     * @apiBody {String} [senha="Senha antiga"] Senha do admin  
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Alterações salvas"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Falha ao salvar alterações"
     * }
     */
    modificarAdminById(req, res){
        const queryId = req.params.id

        Admins.findById(queryId, async (err, admin)=>{
            if(err) return res.status(400).send({message: "ID Invalido", error: err})
            
            if(admin) {
                const {usuario, senha} = req.body
                const {HashPwd} = require('../../services')

                // Modifica os atributos inseridos
                if(usuario!=="" && usuario) admin.usuario = usuario
                if(senha!=="" && senha) admin.senha = await HashPwd(senha)
    
                // Salvamento das alterações
                admin.save((err)=>{
                    if(err) return res.status(400).send({message: "Falha ao salvar alterações", error: err})
                    else return res.status(202).send({message: "Alterações salvas"})
                })
    
            } else {
                return res.status(404).send({message: "Admin nao Encontrado"})
            }
        })
    },

    /**
     * @api {delete} /removeAdmin/:id Remover Admin via ID
     * @apiName removeAdminById
     * @apiGroup Admins
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiParam {String} id ObjectId (_id) do admin
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Admin removido"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "ID invalido"
     * }
     */
    removeAdminById(req, res){
        const removeId = req.params.id

        // Busca e remoção do objeto
        Admins.findByIdAndRemove(removeId, (err, admin)=>{
            if(err) return res.status(400).send({message: "Erro ao remover admin", error: err})
            else if(admin===null) return res.status(400).send({message: "ID inválido"})
            else return res.status(200).send({message: "Admin removido"})
        })
    }
}