const express = require ('express')//Importação do express
const mustache = require('mustache-express')
const cookieParser = require('cookie-parser')
const session = require('express-session')
const flash = require   ('express-flash')

const passport = require ('passport');
const LocalStrategy = require('passport-local').Strategy;

const router = require ('./routes/index')
const helpers = require('./helpers')
const errorHandler = require('./handlers/errorHandler')
const { register } = require('./controllers/userController')

//Configurações//Começo da requisição
const app = express();

app.use(express.json())          //Trata as requisições de corpo (post) como as requisições get são tratadas
app.use(express.urlencoded({extended: true}));

app.use(express.static(__dirname +'/public'));//Seizando a pasta public estática, assim pode ser acessada publicamente

app.use(cookieParser(process.env.SECRET));  
app.use(session({
    secret: process.env.SECRET,
    resave: false,//a sesssão não precisa ser reescrita
    saveUninitialized: false //Se não houver nada a ser salvo não precisa salvar nada
}))     

app.use(flash()); 

//começo do Middleware
app.use(passport.initialize());
app.use(passport.session());

//Irá usar o models  Usuario para fazer o processo de autenticação
const User = require('./models/User');
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Helpers
//Essa função é como uma requisição, o next faz com que a próxima a ser acessada tenha as informações
app.use((req,res,next)=>{       
    //Responde acessando as informações do Locals(cria variáveis globais) para acessar direto das templastes
    res.locals.h = {...helpers};//a função {...object} passa os valores de helpers para  h (como se tivesse clonado), e não o objeto helpers

    //permite ter acesso a todas as mensagens nos flashes  
    res.locals.flashes = req.flash();
    res.locals.user = req.user;
    
    if(req.isAuthenticated()){
        //filtrar menu para logged
        res.locals.h.menu=res.locals.h.menu.filter(i=> i.logged); 
    }else{
        //filtrar menu para guest 
        res.locals.h.menu=res.locals.h.menu.filter(i=>i.guest ); 
    }

    next();
});

app.use('/', router);             //rotas para o site
app.use(errorHandler.notFound);   //Se nenhuma rota for encontrada essa função avisa o erro tanto para o usuário tanto pro cabeçalho de reespostas

//O Middleware está entre a requisição do usuário e a resposta do sistema, fazendo todo o intermediário
//Fim  do Middleware

app.engine('mst', mustache(__dirname+'/views/partials','.mst'));  //config do mustache para a extensão do arquivo de layout
app.set('view engine', 'mst');  //Setar o mustache como view engine para especificar
app.set('views', __dirname + '/views');  //ele pega o diretório do projeto e vai expandir com a página views

module.exports = app;//Exporta o app