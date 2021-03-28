exports.notFound = (req,res,next)=>{
    res.status = 404 //No cabeçalho de respostas o status passa que o erro  foi o 404 de página não encontrada
    res.render("404")
}