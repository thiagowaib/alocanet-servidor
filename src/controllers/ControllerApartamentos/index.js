// * Importações
const {Apartamentos} = require('../../models')
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
     * @apiErrorExample Examplo de Erro:
     * {
     *  message: "Apartamento já cadastrado"
     * }
     */
    novoApto(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {numero, senha} = req.body

        Apartamentos.findOne({numero: numero}, async(err, apto) => {
            if(apto) return res.status(400).send({message: "Apartamento já cadastrado"})

            const {HashPwd} = require('../../services')
            const hashedSenha = await HashPwd(senha)

            const novoApto = new Apartamentos({
                numero: numero,
                senha: hashedSenha
            })
    
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
     * @apiErrorExample Examplo de Erro:
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
                        exp: SetExpDate(Date.now(), 1, "h")
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
     * @apiErrorExample Examplo de Erro:
     * {
     *  message: "Falha ao salvar alterações"
     * }
     */
    modificarSenha(req, res){
        // Confere se o cliente é um Admin
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
        const {numero, senha} = req.body
        Apartamentos.findOne({numero: numero}, async(err, apto) => {
            const {HashPwd} = require('../../services')
            if(senha!=="") apto.senha = await HashPwd(senha)
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
     * @apiErrorExample Examplo de Erro:
     * {
     *  message: "Apartamento não encontrado"
     * }
     */
    removerApto(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const numero = req.params.numero

        Apartamentos.findOneAndRemove({numero: numero}, (err, apto) => {
            if(apto === null) return res.status(404).send({message: "Apartamento não encontrado"})
            else return res.status(200).send({message: "Apartamento descadastrado"})
        })
    },
    

    /**
     * @apiIgnore
     * @api {get} /consultarApto/:numero Consultar Apartamento
     * @apiName consultarAptoPorNumero
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
     *  
     * }
     * @apiErrorExample Examplo de Erro:
     * {
     *  
     * }
     */
    consultarApto(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
    
        const numero = req.params.numero

        Apartamentos.findOne({numero: numero}, (err, apto) => {
            if(apto === null) return res.status(404).send({message: "Apartamento nao Encontrado"})
            const {locacoes, cancelamentos} = apto
            return res.status(200).send({locacoes, cancelamentos})
            /*
            TODO:   Inserir bloco de código lógico para
            TODO:   retornar as informações de  
            TODO:   locação e cancelamentos
            */
        })
    },

    // =========================================
    // ! SEÇÃO PERTENCENTE AO CONTROLLERLOCACAO
    // !
    // addLocacao(req, res){
    //     if(req.payload.belongsTo !== "Apartamentos") return res.status(403).send({message: "Voce nao tem permissao para modificar esse apartamento"})

    //     const {locacaoId} = req.body
    //     const numero = req.payload.numero

    //     Apartamentos.findOne({numero: numero}, (err, apto) => {
    //         if(apto===null) return res.status(404).send({message: "Apartamento nao Encontrado"})
    //         if(apto.locacoes.includes(locacaoId)) return res.status(200).send({message: "Locacao Adicionada"})
            
    //         apto.locacoes.push(locacaoId)
    //         apto.save((err)=>{
    //             if(err) return res.status(400).send({message: "Falha ao adicionar Locacao", error: err})
    //             else return res.status(201).send({message: "Locacao Adicionada"})
    //         })
    //     })

    //     /*
    //         TODO: Inserir bloco lógico para
    //         TODO: restrições de parâmetros
    //     */
    // },
    
    // cancelarLocacao(req, res){
    //     if(req.payload.belongsTo !== "Apartamentos") return res.status(403).send({message: "Voce nao tem permissao para modificar esse apartamento"})
        
    //     const {locacaoId} = req.body
    //     const numero = req.payload.numero

    //     Apartamentos.findOne({numero: numero}, (err, apto) => {
    //         if(apto===null) return res.status(404).send({message: "Apartamento nao Encontrado"})
    //         if(!apto.locacoes.includes(locacaoId)) return res.status(404).send({message: "Locacao nao encontrada"})

    //         apto.locacoes = apto.locacoes.filter(data => data !== locacaoId)

    //         if(apto.cancelamentos.includes(locacaoId)) return res.status(400).send({message: "Cancelamento ja feito"})
    //         apto.cancelamentos.push(locacaoId)

    //         /*
    //         TODO: Inserir bloco lógico para
    //         TODO: restrições de parâmetros
    //         */

    //         /*  
    //         TODO: Inserir bloco lógico
    //         TODO: para cancelamento do objeto 
    //         TODO: de Locação
    //         */

    //         return res.status(200).send({message: `Locacao ${locacaoId} cancelada!`})
    //     })
    // }
    // =========================================
}