// * Importações
const {Apartamentos, Locacoes, Espacos, Parametros} = require('../../models')

// * Exportação dos métodos do controler
module.exports = {
    
    /**
     * @api {get} /authJWT Autêntifica o token de acesso (JWT) do usuário
     * @apiName authJWT
     * @apiGroup Usuários
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }  
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  message: "Token de acesso autêntificado"
     * }
     */
    authJWT(req, res){
        return res.status(200).send({message: "Token de acesso autêntificado"})
    },

    /**
     * @api {get} /buscarDatas Busca as datas em que existem locações
     * @apiName buscarDatas
     * @apiGroup Usuários
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }  
     * 
     * @apiSuccessExample Exemplo de Sucesso:
     * {
     *  datas: []String
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Não há espaços cadastrados"
     * }
     */
    async buscarDatas(req, res){
        // Verifica se há espaços cadastrados
        if(await Espacos.find({}) === null) return res.status(404).send({message: "Não há espaços cadastrados"})

        Locacoes.find({}, (err, locacoes) => {
            if(err) return res.status(400).send({message: "Erro ao buscar locações"})

            // Caso não existam locações, retorna um array vazio
            if(locacoes === null) return res.status(200).send({datas: []})

            const datas = locacoes.map(locacao => {
                return locacao.data
            })

            // Retorna um array de datas
            return res.status(200).send({datas})
        })
    },

    /**
     * @api {post} /buscarDetalhes Busca detalhes da data desejada
     * @apiName buscarDetalhes
     * @apiGroup Usuários
     * @apiVersion 1.0.0
     * 
     * @apiPermission Admin | Apartamento
     * @apiHeader {String} auth Token de acesso JWT
     * @apiHeaderExample {json} Exemplo de Header:
     * {
     *  "auth": [Token de Acesso JWT]
     * }
     * 
     * @apiBody {String} dataDesejada Data desejada para informar detalhes
     * @apiBody {Number} [numeroApto] Número do apartamento (caso o cliente seja um Apartamento)
     * 
     * @apiSuccessExample Exemplo de Sucesso (Apartamentos):
     * {
     *  dados: {
     *      limiteLocacoes: 4,
     *      numeroLocacoes: 2,
     *  },
     *  espacos: [
     *     {nome{STRING}, disponivel{BOOL}, valor{NUMBER}, espacoId{STRING}},
     *     {nome{STRING}, disponivel{BOOL}, valor{NUMBER}, espacoId{STRING}}
     *  ]
     * }
     * @apiSuccessExample Exemplo de Sucesso (Admins):
     * {
     *  dados: [
     *      {espaco{STRING}, apartamento{NUMBER}, desde{STRING}, valor{NUMBER}},
     *      {espaco{STRING}, apartamento{NUMBER}, desde{STRING}, valor{NUMBER}}
     *  ]
     * }
     * @apiErrorExample Exemplo de Erro:
     * {
     *  message: "Erro ao buscar locações"
     * }
     */
    buscarDetalhes(req, res){

        const {dataDesejada, numeroApto} = req.body 

        if(req.payload.belongsTo === "Apartamentos")
        {
            Espacos.find({}, (err, espacos) => {
                if(err) return res.status(400).send({message: "Erro ao buscar espaços"})
    
                // Verifica se há espaços cadastrados
                if(espacos===null) return res.status(404).send({message: "Não há espaços cadastrados"})

                // Compila os dados de cada espaco
                const dadosEspacos = espacos.map(espaco => {
                    // Verifica disponibilidade do espaço na dataDesejada
                    let disponivel
                    if(espaco.ocupados.includes(dataDesejada))
                        disponivel = false
                    else
                        disponivel = true

                    // Consulta o valor e nome do espaço
                    let valor = espaco.valorAtual
                    let nome = espaco.nome
                    return {
                        nome,
                        disponivel,
                        valor,
                        espacoId: espaco._id.toString()
                    }
                })

                // Verifica se há o parâmetro LimiteLocacoes e se existe, retorna o número de locações ativas
                Parametros.findOne({}, (err, param) => {
                    if(err) return res.status(400).send({message: "Erro ao buscar parâmetros"})
                    if(param===null) return res.status(404).send({message: "Parâmetros não inicializados"})

                    if(param.limiteLocacoes > 0)
                    {
                        Apartamentos.findOne({numero: numeroApto}, (err, apto) => {
                            if(err) return res.status(400).send({message: "Erro ao buscar apartamento"})
                            if(apto===null) return res.status(404).send({message: "Apartamento não encontrado"})

                            const dados = {
                                limiteLocacoes: param.limiteLocacoes,
                                numeroLocacoes: apto.locacoes.length
                            }
                            return res.status(200).send({dados, espacos: dadosEspacos})
                        })
                    } else {
                        return res.status(200).send({dados: null, espacos: dadosEspacos})
                    }
                })

            })
        } else {
            Locacoes.find({data: dataDesejada}, (err, locacoes) => {
                if(err) return res.status(400).send({message: "Erro ao buscar locações"})
                if(locacoes===null) return res.status(200).send({dados: []})

                // Compila os dados das locacoes
                const dados = locacoes.map(locacao => {
                    let createdAt = new Date(locacao.createdAt.toString())
                    let dia = createdAt.getDate()
                    let mes = createdAt.getMonth()
                    let ano = createdAt.getFullYear()
                    
                    let desde = `${dia}/${mes >= 10 ? mes : "0"+mes}/${ano}`
                    let espaco = locacao.espaco
                    let apto = locacao.apartamento
                    let valor = locacao.valor
                    return {
                        espaco,
                        apto,
                        desde,
                        valor
                    }
                })

                return res.status(200).send({dados})
            })
        }
    }
}