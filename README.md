# Servidor *AlocaNet*
<img src="https://png.pngtree.com/background/20210709/original/pngtree-blue-big-data-the-internet-banner-picture-image_929540.jpg" alt="banner"
width="100%" height="200px">

> Bem vind@ ao repositório para o servidor da AlocaNet, um serviço de gerenciamento e locação de espaços para condomínios.

<br>

## 👨‍💻 Desenvolvido utilizando
<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg" height="35px">  •  **NodeJs**: Framework utilizado para desenvolver a API.

<img src="https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg" height="35px"> • **MongoDB**: Banco de Dados NoSQL

<img src="https://a.fsdn.com/allura/mirror/apidoc/icon?86b58c0e96fc95ecba2b7b7c4a7da1534d522613afb6b99fa42b82900adfeefc?&w=90" height="35px"> • **ApiDoc**: Biblioteca de documentação de API via JS-Docs

<br>

## 📄 Documentação
Você pode acessar a documentação mais atual da nossa API **[através desse site](https://alocanet-servidor.glitch.me/ "através desse site")**.

<br>

## 🚀 Inicialização de ambiente
Para configurar e inicializar o ambiente de desenvolvimento do servidor AlocaNet, é necessário ter instalado o **[Node](https://nodejs.org/en/ "Node")** (> v16.0.0), juntamente com o npm (> v8.0.0).

Na pasta raíz do diretório, execute os scripts abaixo:

    // Instalação de dependências
    npm install
Após feita a instalação, tudo que resta é criar um arquivo **[.env](https://www.freecodecamp.org/portuguese/news/como-usar-variaveis-de-ambiente-do-node-com-um-arquivo-dotenv-para-node-js-e-npm/ ".env")** na raíz do diretório, onde deverão ser criadas as chaves

| Chaves  | Descrição do Valor  |
| :------------: | :------------: |
| `SERVER_PORT` | {String} Porta do Servidor  |
| `DB_URI`  | {String} URI de acesso ao Mongodb  |
| `JWT_ACCESS_TOKEN_SECRET` | {String} Segredo para geração de JWTs  |

Com isso só resta executar o comando abaixo para inicializar o servidor em `http://localhost:SERVER_PORT`

    // Inicializando o servidor
    npm run start

<br>

## 🤝 Colaboradores
<img src="https://avatars.githubusercontent.com/u/61032370?v=4" height="35px"> **[ • Thiago Waib](https://github.com/thiagowaib " • Thiago Waib")**

<img src="https://avatars.githubusercontent.com/u/78982963?s=64&v=4" height="35px"> **[ • Felipe Ferrari](https://github.com/felipeferrari22 " • Felipe Ferrari")**

<img src="https://avatars.githubusercontent.com/u/103545676?s=64&v=4" height="35px"> **[ • Renan Henrique](https://github.com/xjfgames " • Renan Henrique")**

<img src="https://avatars.githubusercontent.com/u/67720152?s=64&v=4" height="35px"> **[ • Erik Basso](https://github.com/Erik-Basso " • Erik Basso")**


