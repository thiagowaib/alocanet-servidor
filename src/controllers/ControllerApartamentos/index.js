// * Importações
const {Apartamentos, Espacos, Locacoes, Cancelamentos} = require('../../models')
const jwt = require('jsonwebtoken')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {post} /novoApto Criar novo objeto Apartamento
     * @apiName novoApto
     * @apiGroup Apartamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {Number} numero Número do apartamento
     * @apiBody {String} senha Senha de acesso para o apartamento
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Apartamento cadastrado"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Apartamento já cadastrado"
     * }
     */
    novoApto(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {numero, senha} = req.body

        // Busca pelo Apto via Número
        Apartamentos.findOne({numero: numero}, async(err, apto) => {
            if(apto) return res.status(400).send({message: "Apartamento já cadastrado"})

            // Processo de criptografia da senha
            const {HashPwd} = require('../../services')
            const hashedSenha = await HashPwd(senha)

            // Criação do novo objeto
            const novoApto = new Apartamentos({
                numero: numero,
                senha: hashedSenha
            })
    
            // Salvamento do novo objeto
            novoApto.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao cadastrar apartamento", error: err})
                else return res.status(201).send({message: "Apartamento cadastrado"})
            })
        })
    },

    /**
     * @api {post} /loginApto Logar Apartamento
     * @apiName loginApto
     * @apiGroup Apartamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiBody {Number} numero Número do apartamento
     * @apiBody {String} senha Senha do apartamento  
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
    loginApto(req, res){
        const {numero, senha} = req.body
        const {AuthPwd, SetExpDate} = require('../../services')

        Apartamentos.findOne({numero: numero}, async(err, apto) => {
            if(apto) {
                // Autentifica a Senha inserida
                if(await AuthPwd(apto.senha, senha)) {
                    // Dados inbutidos no JWT
                    const jwtPayload = {
                        numero: apto.numero,
                        belongsTo: "Apartamentos",
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
                return res.status(404).send({message: "Apartamento não cadastrado"})
            }
        })
    },

    /**
     * @api {put} /modificarSenha Modificar senha do Apartamento
     * @apiName modificarSenha
     * @apiGroup Apartamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {Number} numero Número do apartamento
     * @apiBody {String} [senha] Nova Senha do apartamento  
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
    modificarSenha(req, res){
        // Confere se o cliente é um Admin
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
        const {numero, senha} = req.body
        
        // Busca o Apartamento via Número
        Apartamentos.findOne({numero: numero}, async(err, apto) => {
            const {HashPwd} = require('../../services')

            // Criptografa e atribui a nova senha
            if(senha!=="" && senha) apto.senha = await HashPwd(senha)

            // Salvamento do objeto
            apto.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao salvar alterações", error: err})
                else return res.status(202).send({message: "Alterações Salvas"})
            })
        })
    },

    /**
     * @api {delete} /removerApto/:numero Remover Apartamento
     * @apiName removerAptoPorNumero
     * @apiGroup Apartamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiParam {Number} numero Número do apartamento
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Apartamento descadastrado"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Apartamento não encontrado"
     * }
     */
    removerApto(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const numero = req.params.numero

        // Busca e remove o objeto Apartamento
        Apartamentos.findOneAndRemove({numero: numero}, async (err, apto) => {
            if(apto === null) return res.status(404).send({message: "Apartamento não encontrado"})

            // Busca e remove os objetos de Locação referentes ao Apto
            const locacoes = await Locacoes.find({apartamento: numero})
            locacoes.forEach(async (locacao) => {                         // Remove cada uma das locações

                // Remover a data da locação do ocupados[] no espaço da locação
                const espaco = await Espacos.findById(locacao.espacoId)
                espaco.ocupados = espaco.ocupados.filter((data) => {
                    return data !== locacao.data
                })
                espaco.save()

                await Locacoes.findByIdAndDelete(locacao._id.toString())
            })                    

            // Busca e remove os objetos de Cancelamento referentes ao Apto
            const cancelamentos = await Cancelamentos.find({apartamento: numero})
            cancelamentos.forEach(async (cancelamento) => {               // Remove cada uma das locações
                await Cancelamentos.findByIdAndDelete(cancelamento._id.toString())
            })

            return res.status(200).send({message: "Apartamento descadastrado"})
        })
    },
    

    /**
     * @api {get} /consultarApto/:numero Consultar Apartamento
     * @apiName consultarAptoPorNumero
     * @apiGroup Apartamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiParam {Number} numero Número do apartamento
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  "locacoes": [{Objeto Locação}, {Objeto Locação}],
     *  "cancelamentos": [{Objeto Cancelamento}, {Objeto Cancelamento}]
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Apartamento não encontrado"
     * }
     */
    consultarApto(req, res){    
        const numero = req.params.numero

        Apartamentos.findOne({numero: numero}, async (err, apto) => {
            if(apto === null) return res.status(404).send({message: "Apartamento nao encontrado"})
            const {locacoes, cancelamentos} = apto
            // return res.status(200).send({locacoes, cancelamentos})
            
            // Compila os dados das Locações do Apto
            let dadosLocacoes = await Promise.all(locacoes.map(async (id) => {
                return await Locacoes.findById(id)
            }))

            // Compila os dados dos Cancelamentos do Apto
            let dadosCancelamentos = await Promise.all(cancelamentos.map(async (id) => {
                return await Cancelamentos.findById(id)
            }))
            
            return res.status(200).send({locacoes: dadosLocacoes, cancelamentos: dadosCancelamentos})
        })
    }
}