const mongoose = require ('mongoose');
const Post = mongoose.model('Post');


exports.index = async(req,res)=>{
    let responseJson = {
        pageTitle: 'HOME',
        posts:[],
        tags:[],
        tag:''
    }

    responseJson.tag = req.query.t;
    const postFilter = (typeof responseJson.tag != 'undefined') ? {tags:responseJson.tag}: {};
    
    //Requisições que retornam promises
    const tagsPromise = Post.getTagsList();
    const postsPromise = Post.find(postFilter).populate('author'); //O find vai procurar tudo relacionado a  posts e o await vai esperar a resposta com o BD
    
    // Pega as duas promises e executa elas ao mesmo tempo em  array, deixando o processo mais rápido
    const [ tags, posts ] = await Promise.all([tagsPromise, postsPromise]);

    for(let i in tags){
        if(tags[i]._id == responseJson.tag){
            tags[i].class = "selected"
        }
    }
    responseJson.tags = tags;
    responseJson.posts = posts;
    
    res.render('home', responseJson );
}
