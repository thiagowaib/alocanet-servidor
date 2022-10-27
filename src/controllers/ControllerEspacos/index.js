// * Importações
const {Espacos, Apartamentos, Locacoes, Cancelamentos} = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {post} /novoEspaco Criar novo objeto Espaço
     * @apiName novoEspaco
     * @apiGroup Espaços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} nome Nome do Espaço
     * @apiBody {Number} valor Valor (R$) do Espaço
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Espaço cadastrado"
     * }
     * @apiErrorExample Examplo de Erro:
     * {
     *  message: "Espaço já cadastrado"
     * }
     */
    novoEspaco(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const {nome, valor} = req.body

        Espacos.findOne({nome: nome}, async(err, espaco) => {
            if(espaco) return res.status(400).send({message: "Espaço já cadastrado"})

            // Cria novo objeto
            const novoEspaco = new Espacos({
                nome: nome,
                valorAtual: valor
            })

            // Salvamento do novo objeto
            novoEspaco.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao cadastrar espaço", error: err})
                else return res.status(201).send({message: "Espaço cadastrado"})
            })
        })
    },

    /**
     * @api {get} /buscarEspacos Buscar espaços cadastrados
     * @apiName buscarEspacos
     * @apiGroup Espaços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiSuccess (Sucesso 200) {Object[]} espacos Array de Espaços
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  [{
     *      "id": {objectId},
     *      "nome": {String},
     *      "valor": {Number}
     *  }]
     * }
     */
    buscarEspacos(req, res){
        // Busca os espaços e retorna seus dados
        Espacos.find({}, (err, espacos) => {
            const dados = espacos.map((espaco) => {
                return {
                    id: espaco._id,
                    nome: espaco.nome,
                    valor: espaco.valorAtual,
                }
            })
            return res.status(200).send(dados)
        })
    },

    /**
     * @api {put} /modificarEspaco/:id Modificar dados do Espaço
     * @apiName modificarEspacoById
     * @apiGroup Espaços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     *  @apiParam {String} id ObjectId (_id) do Espaço
     * 
     * @apiBody {String} [nome] Novo nome do espaço
     * @apiBody {Number} [valor] Novo valor do espaço
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
     modificarEspacoById(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})
        
        const queryId = req.params.id

        // Busca o espaço via ID
        Espacos.findById(queryId, (err, espaco) => {
            if(espaco===null) return res.status(404).send({message: "Espaço não encontrado"})
            
            const {nome, valor} = req.body

            // Modifica os atributos inseridos
            if(nome!=="" && nome) espaco.nome = nome
            if(valor!==0 && valor) espaco.valorAtual = valor

            // Salvamento dos atributos alterados
            espaco.save((err)=>{
                if(err) return res.status(400).send({message: "Falha ao salvar alterações", error: err})
                else return res.status(202).send({message: "Alterações Salvas"})
            })
        })
    },

    /**
     * @api {delete} /removerEspaco/:id Remover Espaço via ID
     * @apiName removerEspacoById
     * @apiGroup Espaços
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiParam {String} id ObjectId (_id) do Espaço
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Espaço removido"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "ID invalido"
     * }
     */
    removerEspacoById(req, res){
        if(req.payload.belongsTo !== "Admins") return res.status(403).send({message: "Permissão negada [!Admin]"})

        const removeId = req.params.id

        // Busca e remove o objeto
        Espacos.findByIdAndRemove(removeId, async (err, espaco)=>{
            if(err) return res.status(400).send({message: "Erro ao remover espaço", error: err})
            else if(espaco===null) return res.status(400).send({message: "ID inválido"})

            // Busca e remove os objetos de Locação referentes ao Espaço
            const locacoes = await Locacoes.find({espacoId: removeId})
            locacoes.forEach(async (locacao) => {                         // Remove cada uma das locações
                // Remove o ID de locacoes[] do apto da locação
                const apto = await Apartamentos.findById(locacao.apartamentoId)
                apto.locacoes = apto.locacoes.filter(id => id !== locacao._id.toString())
                apto.save()
                await Locacoes.findByIdAndDelete(locacao._id.toString())
            })                    

            // Busca e remove os objetos de Cancelamento referentes ao Espaço
            const cancelamentos = await Cancelamentos.find({espacoId: removeId})
            cancelamentos.forEach(async (cancelamento) => {               // Remove cada uma das locações
                // Remove o ID de cancelamentos do apto do cancelamento
                const apto = await Apartamentos.findById(cancelamento.apartamentoId)
                apto.cancelamentos = apto.cancelamentos.filter(id => id !== cancelamento._id.toString())
                apto.save()
                await Cancelamentos.findByIdAndDelete(cancelamento._id.toString())
            })
            
            return res.status(200).send({message: "Espaço removido"})
        })
    }

}