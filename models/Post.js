const mongoose = require('mongoose')
const slug = require ('slug')

mongoose.Promise = global.Promise//passa o promise do próprio mogoose

const ObjectId = mongoose.Schema.Types.ObjectId;

const postSchema = new mongoose.Schema({//função do post
    photo: String,
    title: {
        type: String,
        trim: true,  //o trim tira espaços inutilizáveis começo e final. Ex.: "   Oi     " depois do trim "Oi"  
        required: 'O post precisa de um título'//Opção de campo obrigatório dentro dos posts
    },
    slug: String,
    body:{
        type: String,
        trim: true
    },
    tags:[String],//especifica que vai ser um array de strings
    author:ObjectId
});

//Antes de salvar vai executar esta função
postSchema.pre('save', function(next){
    if(this.isModified('title')){// Se o titulo for modificado ele retorna gera outor slug. Quando o post é criado pela primeira vez ele indentifica como modified também e cria o slug inicial
        this.slug = slug(this.title, {lower:true})//o atributo do objeto 'lower' faz com que o slug fique inteiro minúsculo
    }
    next();
})

module.exports = mongoose.model('Post', postSchema)