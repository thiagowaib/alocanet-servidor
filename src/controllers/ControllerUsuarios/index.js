// * Importações
const {Admins, Apartamentos, Locacoes, Espacos} = require('../../models')
const jwt = require('jsonwebtoken')

// * Exportação dos métodos do controler
module.exports = {
    
    /**
     * @api {get} /authJWT Autêntifica o token de acesso (JWT) do usuário
     * @apiName authJWT
     * @apiGroup Usuarios
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
     * @apiGroup Usuarios
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

    buscarDetalhes(req, res){
        const data = req.params.data

        Espacos.find({}, (err, espacos) => {
            if(err) return res.status(400).send({message: "Erro ao buscar espaços"})

            // Verifica se há espaços cadastrados
            if(espacos===null) return res.status(404).send({message: "Não há espaços cadastrados"})

            
        })
    }


}