// * Importações
const {Parametros} = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {get} /initiParametros Inicializar objeto Parametros
     * @apiName initiParametros
     * @apiGroup Parâmetros
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Parâmetros inicializados"
     * }
     * @apiErrorExample Examplo de Erro:
     * {
     *  message: "Parâmetros já inicializados"
     * }
     */
    initParametros(req, res){
        Parametros.findOne({}, (err, obj) => {
            if(obj!==null) return res.status(400).send({message: "Parâmetros já inicializados"})

            const param = new Parametros()
            param.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao inicializar parâmetros", error: err})
                else return res.status(201).send({message: "Parâmetros inicializados"})
            })
        })
    },

    /**
     * @api {get} /buscarParametros Buscar parâmetros
     * @apiName buscarParametros
     * @apiGroup Parâmetros
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiSuccess (Sucesso 200) {Object[]} parametros Array de parâmetros
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *      "minDiasAlocar": {Number},
     *      "maxDiasAlocar": {Number},
     *      "minDiasCancelar": {Number},
     *      "maxDiasCancelar": {Number},
     *      "limiteLocacoes": {Number},
     * }
     */
     buscarParametros(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        Parametros.findOne({}, (err, param) => {
            const dados = {
                minDiasAlocar: param.minDiasAlocar,
                maxDiasAlocar: param.maxDiasAlocar,
                minDiasCancelar: param.minDiasCancelar,
                maxDiasCancelar: param.maxDiasCancelar,
                limiteLocacoes: param.limiteLocacoes,                
            }
            return res.status(200).send(dados)
        })
    },

    /**
     * @api {put} /modificarParametro/:tag/:value Modificar Parâmetro
     * @apiName modificarParametro
     * @apiGroup Parâmetros
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiParam {String} tag Nome "tag" do parâmetro
     * @apiParam {Number} value Novo valor do parâmetro
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
     modificarParametro(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
        const tag = req.params.tag.toLowerCase()
        let value = 0
        
        try{
            value = parseInt(req.params.value)
        }catch(err){return res.status(400).send({message: `Value '${value}' inválido`, error: err})}

        Parametros.findOne({}, (err, param) => {
            if(err) return res.status(400).send({message: "Erro ao acessar parâmetros", error:err})
            
            switch (tag) {
                case "mindiasalocar":
                    if(value) param.minDiasAlocar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "maxdiasalocar":
                    if(value) param.maxDiasAlocar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "mindiascancelar":
                    if(value) param.minDiasCancelar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "maxdiascancelar":
                    if(value) param.maxDiasCancelar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "limitelocacoes":
                    if(value) param.limiteLocacoes = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                default:
                    return res.status(400).send({message:"Tag errada",tagsDisponiveis: [
                        "minDiasAlocar",
                        "maxDiasAlocar",
                        "minDiasCancelar",
                        "maxDiasCancelar",
                        "limiteLocacoes"
                    ]})
            }
        })
    },

    

    // minDiasAlocar: {
    //     type: Number,
    //     default: 0
    // },
    // maxDiasAlocar: {
    //     type: Number,
    //     default: 0
    // },
    // minDiasCancelar: {
    //     type: Number,
    //     default: 0
    // },
    // maxDiasCancelar: {
    //     type: Number,
    //     default: 0
    // },
    // limiteLocacoes: {
    //     type: Number,
    //     default: 0
    // }

}