const express = require ('express')//Importação do express
const router = require ('./routes/index')
const mustache = require('mustache-express')

//Configurações

const app = express()

app.use('/', router)//rotas para o site

app.use(express.json())//Trata as requisições de corpo (post) como as requisições get são tratadas

app.engine('mst', mustache())//configdo mustache para a extensão do arquivo de layout
app.set('view engine', 'mst')//Setar o mustache como view engine para especificar
app.set('views', __dirname + '/views')//ele pega o diretório do projeto e vai expandir com a página views

module.exports = app//Exporta o app