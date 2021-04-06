const mongoose = require('mongoose')
const Post = mongoose.model('Post')

exports.view = async(req,res) =>{
    const post = await Post.findOne({ slug:req.params.slug })
    res.render('view', {post})
}

//renderiza o formulário de adição
exports.add = (req, res)=>{
    res.render('postAdd');
}
//Adição do Posts
exports.addAction= async(req,res)=>{//cria a função anônima para addAction
    req.body.tags = req.body.tags.split(',').map(t=>t.trim())//vai splitar o vetor das tags separando cada uma por vírgula
    req.body.author = req.user._id;

    const post = new Post(req.body);//Requisição post, pois os dados foram enviados internamente. quando são query é pq os dados são pegos na url
    try{
        await post.save();//O async e o await faz o sistema esperar a resposta do mongoDB nesse caso para depois disso continuar rodando a aplicação
    }catch(error){
        req.flash('error', 'Erro: ' + error.message)
        return res.redirect('/post/add')//depois da mensagem de erro ele retorna para a página de add, o return faz com que termine a execução
    } 
    
    req.flash('success', 'Post salvo com sucesso!');
    res.redirect('/');
}

//Formulário de edição
exports.edit = async(req,res)=>{
    //1.Pegar as inforaçôes do post em questão
    const post = await Post.findOne({ slug:req.params.slug })// afunção findOne busca um item em específico
    //2.Carregar o formulário de edição
    res.render('postEdit', {post})
}

//Edição dos Posts
exports.editAction = async(req,res)=>{
    req.body.slug = require('slug')(req.body.title, {lower: true})
    //req.body.slug = slug(req.body.title, {lower: true})//pode ser feita assim também, porém precisara importar o slug lá em cima assim const slug = require('slug')
    
    req.body.tags = req.body.tags.split(',').map(t=>t.trim())//vai splitar o vetor das tags separando cada uma por vírgula
    //1.Procurar o item enviado
    try{
    const post = await  Post.findOneAndUpdate({
        
        slug:req.params.slug},
        req.body,
        {

            //2. Pegar os dados e atualizar
            new:true,//Retornar NOVO item atualizado
            runValidators: true // Ele coloca as validações como true Ex.: required
        }
        )
    //3. Mostrar mensagem de sucesso e redirecionar para a home
    }catch(error){
        req.flash('error', 'Erro: ' + error.message)
        return res.redirect('/post/'+req.params.slug+'/edit')//depois da mensagem de erro ele retorna para a página de add, o return faz com que termine a execução
    }
    req.flash("success","Post atualizado com sucesso!")

    res.redirect('/')
    
}