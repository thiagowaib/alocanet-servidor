// * Importações
const {Cancelamentos, Locacoes, Apartamentos, Espacos, Parametros} = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {put} /cancelar/:id Cancelar Locação
     * @apiName cancelarById
     * @apiGroup Cancelamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Apartamentos
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiParam {Number} id _id (objectID) da Locação
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Locação cancelada com sucesso"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Locação não encontrada"
     * }
     */
    async cancelarById(req, res){
        if(req.payload.belongsTo !== "Apartamentos") return res.status(403).send({message: "Permissão negada [!Apartamento]"})

        // Busca dados da locação
        const locacao = await Locacoes.findById(req.params.id)
        if(locacao === null) return res.status(404).send({message: "Locação não encontrada"})

        // Busca os parâmetros cadastrados no BD
        const {minDiasCancelar, maxDiasCancelar} = await Parametros.findOne({})
        
        // Calcula a diferença de dias entre a data atual e a data da locação
        const dataAtual = new Date()
        const dataFormatada = `${locacao.data.split("/")[2]}/${locacao.data.split("/")[1]}/${locacao.data.split("/")[0]}`
        const dataDesejada = new Date(dataFormatada)
        const diffDias = Math.floor((dataDesejada.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24))

        // Verifica se minDiasCancelar < diffDias < maxDiasCancelar
        if(maxDiasCancelar > 0 && diffDias > maxDiasCancelar) return res.status(401).send({message: `A data desejada excede o máximo de ${maxDiasCancelar} dias de antecedência`})
        else if(minDiasCancelar > 0 && diffDias < minDiasCancelar) return res.status(401).send({message: `A data desejada excede o mínimo de ${minDiasCancelar} dias de antecedência`})
        
        // Cria novo objeto de cancelamento
        const cancelamento = new Cancelamentos({
            data: locacao.data,
            apartamentoId: locacao.apartamentoId,
            apartamento: locacao.apartamento,
            espacoId: locacao.espacoId,
            espaco: locacao.espaco,
            valor: locacao.valor,
        })

        // Realiza o salvamento do novo objeto
        cancelamento.save((err, savedCancelamento) => {
            if(err) return res.status(400).send({message: "Falha ao cancelar locação", error:err})

            Espacos.findById(locacao.espacoId, (err, espaco) => {
                if(espaco===null) return res.status(404).send({message: "Espaço da locação não encontrado"})
                
                Apartamentos.findById(locacao.apartamentoId, (err, apto) => {
                    if(apto===null) return res.status(404).send({message: "Apartamento da locação não encontrado"})
                    
                    // Remove o _id de []locacoes e adiciona em []cancelamentos do objeto Apartamento
                    apto.locacoes = apto.locacoes.filter(id => id !== locacao._id.toString())
                    apto.cancelamentos.push(savedCancelamento._id)
    
                    apto.save((err) => {
                        if(err) return res.status(400).send({message: "Falha ao mover id de locação no objeto apartamento", error:err})
                    })
                })

                // Remove a data de []ocupados do objeto Espaço
                espaco.ocupados = espaco.ocupados.filter(data => data !== locacao.data)
                espaco.save((err) => {
                    if(err) return res.status(400).send({message: "Falha remover data do objeto espaço", error: err})
                })

                // Procura e remove o objeto de Locação
                Locacoes.findByIdAndRemove(locacao._id, (err) => {
                    if(err) return res.status(400).send({message: "Falha ao remover locação após cancelamento", error: err})
                    return res.status(200).send({message: "Locação cancelada com sucesso"})
                })
            })
        })
    },

    /**
     * @api {delete} /removerCancelamento/:id Remover Cancelamento
     * @apiName removerCancelamentoById
     * @apiGroup Cancelamentos
     * @apiVersion 1.0.0
     * 
     * @apiPermission Nenhum
     * 
     * @apiParam {Number} id _id (objectID) do Cancelamento
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Cancelamento removido"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Falha ao remover cancelamento"
     * }
     */
    async removerCancelamentoById(req, res){

        const cancelamentoId = req.params.id

        // Busca e remove o objeto de Cancelamentos
        Cancelamentos.findByIdAndRemove(cancelamentoId, (err, cancelamento) => {
            if(err) return res.status(400).send({message: "Falha ao remover cancelamento", error: err})
            
            // Busca o Apartamento para retirar o ID do array de cancelamentos
            Apartamentos.findById(cancelamento.apartamentoId, (err, apto) => {
                apto.cancelamentos = apto.cancelamentos.filter(id => id !== cancelamentoId.toString())
                apto.save((err)=>{if(err) return res.status(400).send({message:"Erro ao remover cancelamento do objeto Apartamento", error: err})})
            })

            return res.status(200).send({message: "Cancelamento removido"})
        })
    }
}