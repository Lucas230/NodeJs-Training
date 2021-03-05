//importações
const app = require ('./app')
const mongoose = require ('mongoose')

require ('dotenv').config({path:'variables.env'})

//Conexão ao Banco de Dados
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useUnifiedTopology: true })
mongoose.Promise =  global.Promise //permite o mongoose usar ecma script 6
mongoose.connection.on('error', (error)=>{
	console.error("ERRO: "+ error.message)
}) 

app.set('port', process.env.PORT || 7777)//passa a porta do banco de dados e se caso ela não existir é utilizado o 7777
const server = app.listen(app.get('port'), ()=>{
	console.log("Servidor rodando na porta " + server.address().port)
	})