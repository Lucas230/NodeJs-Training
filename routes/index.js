// Nesse arquivo ficam as rotas prinsipais  do sistema

//importações
const express = require('express')


//Rotas
const router = express.Router()//criação da rota inicial


router.get('/', (req,res)=>{
    let obj = {
        nome: req.query.nome,
        idade: req.query.idade,
        ingredientes:[
            {nome:"Arroz", qt: '20g'},
            {nome: "Feijão", qt: '30g'}
        ],
        interesses:['node', 'javascript','working'],
        teste: '<strong>Testando negrito</strong>',
        mostrar:true   
        }
    
    let array = [1,22,33,23,21]
    res.render('home', obj )//renderiza a home
  //res.render('home', {} )//pode ser usado assim tbm
})







/*  A função 'req' contém todas as informações relacionadas a requisição, como por exemplo: 
    Cabeçalhos de requisição, Parâmetros especificos que foram enviados.
    ////
    res.send("Olá, "+req.query.nome+", voce tem "+ req.query.idade +" anos") 
    a função 'req.query.variável' é uma maneira de acessar parâmetros via método get (pela url por exemplo)
    Requisições post (aquelas que são tratadas no corpo do programa) podem ser tratadas como get ao
    adicionar app.use(express.json()) como esta expecificado no app.js */
//GET: req.query
//POST: req.body
//Parâmetros da url: req.params
//SEND: enviar um texto
//JSON: enviar um json (requisição ou obejeto por exemplo)

/*router.get('/', (req,res) => { //rota da  página inicial
    let nome = req.query.nome
    let idade = req.query.idade
    let sobrenome = req.query.sobrenome 

    let resposta = {nomeCompleto: nome +' '+ sobrenome}
    res.json(
        //resposta //exibe o objeto
        req.query//mandando a requisição inteira como resposta
    )
	//res.send("Olá, "+ nome +", voce tem "+ idade +" anos") //ou usa o res.send ou o res.json
})*/

//como pegar parâmetros específicos na sua rota
//router.get('/posts/:slug'/*id*/, (req,res)=>{ 
    //let id = req.params.id//passando os parâmetros para o id
    // res.send("ID do post: "+ id) //pode ser acessado por: http://localhost:7777/posts/ID
    //O slug contém o titulo dos posts 
    //let slug = req.params.slug 
    //res.send("Slug do post: "+ slug)//pode ser acessado por: http://localhost:7777/posts/título-a-ser-passado//
//})



/*router.get('/sobre', (req, res)=>{//rota sobre a página sobre
    res.send("Página SOBRE:")
})*/

module.exports = router 