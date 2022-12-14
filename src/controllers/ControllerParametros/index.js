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
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Parâmetros já inicializados"
     * }
     */
    initParametros(req, res){
        Parametros.findOne({}, (err, obj) => {
            if(obj!==null) return res.status(400).send({message: "Parâmetros já inicializados"})

            // Inicializa o objeto de parâmetros
            const param = new Parametros()

            // Salva o objeto de parâmetros
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
     * @apiPermission Admin | Apartamento
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
     * @apiErrorExample Exemplo de Erro:
     * {
     *      message: "Parâmetros não inicializados"
     * }
     */
     buscarParametros(req, res){
        // Busca os parâmetros
        Parametros.findOne({}, (err, param) => {
            if(param===null) return res.status(404).send({message: "Parâmetros não inicializados"})
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
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Falha ao salvar alterações"
     * }
     */
     modificarParametro(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
        const tag = req.params.tag.toLowerCase() //Parâmetro a ser alterado
        let value = 0                            //Novo Valor do parâmetro
        
        // Verifica se o valor inserido é um número
        try{
            value = parseInt(req.params.value)
        }catch(err){
            return res.status(400).send({message: `Value '${value}' inválido`, error: err})
        }

        // Busca o objeto de parâmetros
        Parametros.findOne({}, (err, param) => {
            if(err) return res.status(400).send({message: "Erro ao acessar parâmetros", error:err})
            if(param===null) return res.status(404).send({message: "Parâmetros não inicializados"})

            // Identifica qual parâmetro deve ser alterado
            switch (tag) {
                case "mindiasalocar":
                    // Verififica se maxDiasAlocar > minDiasAlocar
                    if(value && param.maxDiasAlocar > 0 && value > param.maxDiasAlocar) return res.status(400).send({message: "minDiasAlocar deve ser <= que maxDiasAlocar"})
                    
                    // Atualiza o valor do parâmetro e o salva
                    if(value!==null && value >= 0) param.minDiasAlocar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "maxdiasalocar":
                    // Verififica se maxDiasAlocar > minDiasAlocar
                    if(value && param.minDiasAlocar > 0 && value < param.minDiasAlocar) return res.status(400).send({message: "maxDiasAlocar deve ser >= que minDiasAlocar"})
                    
                    // Atualiza o valor do parâmetro e o salva
                    if(value!==null) param.maxDiasAlocar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "mindiascancelar":
                    // Verififica se maxDiasCancelar > minDiasCancelar
                    if(value && param.maxDiasCancelar > 0 && value > param.maxDiasCancelar) return res.status(400).send({message: "minDiasCancelar deve ser <= que maxDiasCancelar"})
                    
                    // Atualiza o valor do parâmetro e o salva
                    if(value!==null) param.minDiasCancelar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "maxdiascancelar":
                    // Verififica se maxDiasCancelar > minDiasCancelar
                    if(value && param.minDiasCancelar > 0 && value < param.minDiasCancelar) return res.status(400).send({message: "maxDiasCancelar deve ser >= que minDiasCancelar"})
                    
                    // Atualiza o valor do parâmetro e o salva
                    if(value!==null) param.maxDiasCancelar = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                case "limitelocacoes":
                    if(value!==null) param.limiteLocacoes = value
                        param.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar alterações"})
                            else return res.status(200).send({message: "Alterações salvas"})
                        })
                    break;
                default:
                    return res.status(400).send({message:"Tag inválida",tagsDisponiveis: [
                        "minDiasAlocar",
                        "maxDiasAlocar",
                        "minDiasCancelar",
                        "maxDiasCancelar",
                        "limiteLocacoes"
                    ]})
            }
        })
    }
}