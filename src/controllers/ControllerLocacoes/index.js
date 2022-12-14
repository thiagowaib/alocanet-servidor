// * Importações
const {Locacoes, Apartamentos, Espacos, Parametros} = require('../../models')

// * Exportação dos métodos do Controller
module.exports = {

    /**
     * @api {post} /alocar Realizar locação
     * @apiName alocar
     * @apiGroup Locações
     * @apiVersion 1.0.0
     * 
     * @apiPermission Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} data Data (dd/mm/yyyy) da locação
     * @apiBody {Number} apartamento Número do Apartamento
     * @apiBody {String} espacoId _id (ObjectId) do Espaço
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Locação feita com sucesso"
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Espaço já ocupado na data '22/09/2022'"
     * }
     */
    alocar(req, res){
        if(req.payload.belongsTo !== "Apartamentos") return res.status(403).send({message: "Permissão negada [!Apartamento]"})

        const {data, apartamento, espacoId} = req.body

        // Confere se a data está no formato dd/mm/yyyy
        const regexData = /^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}$/i
        if(data.match(regexData) === null) return res.status(400).send({message: `A data '${data}' não está no formato dd/mm/yyyy`})

        Locacoes.findOne({data: data, espacoId: espacoId}, async(err, obj) => {
            if(obj) return res.status(400).send({message: `Espaço já ocupado na data '${data}'`})

            // Busca os parâmetros cadastrados no BD
            const {minDiasAlocar, maxDiasAlocar, limiteLocacoes} = await Parametros.findOne({})

            // Confere o limite de locações e a quantidade de locações desse apartamento
            const numLocacoes = (await Locacoes.find({apartamento: apartamento})).length
            if(numLocacoes > limiteLocacoes && limiteLocacoes > 0) return res.status(401).send({message: `Limite de '${limiteLocacoes}' locações já atingido`})
            
            // Calcula a diferença de dias entre a data atual e a data da locação
            const dataAtual = new Date()
            const dataFormatada = `${data.split("/")[2]}/${data.split("/")[1]}/${data.split("/")[0]}`
            const dataDesejada = new Date(dataFormatada)
            const diffDias = Math.floor((dataDesejada.getTime() - dataAtual.getTime()) / (1000 * 60 * 60 * 24))

            // Verifica se minDiasAlocar < diffDias < maxDiasAlocar
            if(diffDias < 0) return res.status(401).send({message: "A data selecionada já está no passado"})
            else if(maxDiasAlocar > 0 && diffDias > maxDiasAlocar) return res.status(401).send({message: `A data desejada excede o máximo de ${maxDiasAlocar} dias de antecedência`})
            else if(minDiasAlocar > 0 && diffDias < minDiasAlocar) return res.status(401).send({message: `A data desejada excede o mínimo de ${minDiasAlocar} dias de antecedência`})

            Espacos.findById(espacoId, (err, espaco) => {
                Apartamentos.findOne({numero: apartamento}, (err, apto) => {      
                    
                    // Cria novo objeto de Locação
                    const locacao = new Locacoes({
                        data: data,
                        apartamentoId: apto._id,
                        apartamento: apartamento,
                        espacoId: espacoId,
                        espaco: espaco.nome,
                        valor: espaco.valorAtual
                    })

                    // Salva o objeto Locação
                    locacao.save((err, locacaoSalva) => {
                        if(err) return res.status(400).send({message: "Falha ao criar locação", error: err})
                        
                        // Salva a data no array de ocupados do espaço
                        espaco.ocupados.push(data)
                        espaco.save((err)=>{
                            if(err) return res.status(400).send({message: "Falha ao salvar ocupação no objeto 'espaco'", error: err})

                            // Salva o _id da locação no array de locações do apartamento
                            apto.locacoes.push(locacaoSalva._id)
                            apto.save((err)=>{
                                if(err) return res.status(400).send({message: "Falha ao salvar id da locação no objeto 'apartamento'", error: err})
                                else return res.status(200).send({message: "Locação feita com sucesso"})
                            })
                        })
                    })
                })
            })
        })
    }

}