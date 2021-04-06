const mongoose = require ('mongoose');
const Post = mongoose.model('Post');


exports.index = async(req,res)=>{
    let responseJson = {
        pageTitle: 'HOME',
        posts:[]
    }
    const posts = await Post.find(); //O find vai procurar tudo relacionado a  posts e o await vai esperar a resposta com o BD
    responseJson.posts = posts;
    
    res.render('home', responseJson );//renderiza a home
    //res.render('home', {} );//pode ser usado assim tbm
}



/*exports.userMiddleware = (req, res, next)=>{
    let info = {name: "Lucas", id: 230}
    req.userInfo= info
    next()
}*/