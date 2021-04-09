const mongoose = require('mongoose')
const slug = require('slug')

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
    body: {
        type: String,
        trim: true
    },
    tags: [String],//especifica que vai ser um array de strings
    author: {
        type: ObjectId,
        //Manda a referência para o módulo User
        ref: 'User'
    }
});

//Antes de salvar vai executar esta função
postSchema.pre('save', async function (next) {
    if (this.isModified('title')) {// Se o titulo for modificado ele retorna gera outor slug. Quando o post é criado pela primeira vez ele indentifica como modified também e cria o slug inicial
        this.slug = slug(this.title, { lower: true });//o atributo do objeto 'lower' faz com que o slug fique inteiro minúsculo

        //Cria uma expressão regular que vai achar qualquer variação de um slug espcífico para não ocorrer repetições
        const slugRegex = new RegExp(`^(${this.slug})((-[0-9]{1,})?)$`, 'i');

        //Usa um construtor para ser usado como model, assim consultando no banco de dados os slugs do posts específicos
        const postsWithSlug = await this.constructor.find({ slug: slugRegex });

        if (postsWithSlug.length > 0) {
            this.slug = `${this.slug}-${postsWithSlug.length + 1}`
        }
    }
    next();
});

postSchema.statics.getTagsList = function () {
    //O banco de dados está fazendo o trabalho com aggregate
    return this.aggregate([
        { $unwind: '$tags' },
        //Gera grupos de tags e contagem da repetição de cada tag
        { $group: { _id: '$tags', count: { $sum: 1 } } },
        //Ele ordena os grupos de tags em ordem decrescente (-1 decrescente, 1 crescente)
        { $sort: { count: -1 } }
    ]);
}

postSchema.statics.findPosts = function (filters = {}) {

    //Retorna o autor referenciado em user
    return this.find(filters).populate('author');

    /*return this.aggregate([
        //O banco procura os itens com base nos filtros inseridos
        { $match: filters },
        //O lookup pesquisa em outra parte do banco de dados informações com a tabela Posts
        {
            $lookup: {
                from: 'users',
                //Pega a variável author do Post e atribui ela para uma var chamada de author
                let: { 'author': '$author' },
                //Cria uma série de ações
                pipeline: [
                    //O banco vai comparar o author com o Id de users
                    { $match: { $expr: { $eq: ['$$author', '$_id'] } } },//Os dois símbolos de $ faz o banco usar a var author declarada logo acima, se fosse apenas uma ele usaria a var da consulta
                    //Garante que irá vir apenas um resultado
                    { $limit: 1 }
                ],
                //Salva as ações dessa consulta ao banco como o obejto author
                as: 'author'
            }
        },
        //Essa função joga o primeito elemento do array para author
        { $addFields:{
            'author':{ $arrayElemAt:['$author', 0]}
        }}
    ]);*/
}
module.exports = mongoose.model('Post', postSchema);