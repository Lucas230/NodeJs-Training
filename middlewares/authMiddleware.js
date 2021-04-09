exports.isLogged = (req, res, next) =>{
    if(!req.isAuthenticated()){
        req.flash('error', 'Ops você não tem permissão para acessar esta página');
        res.redirect('/users/login');
        return;
    }
    next();
}

exports.changePassword = (req, res) => {
    //1. Confirmar que as senhas batem
    if(req.body.senha != req.body['senha-confirma']){
        req.flash('error', 'As senhas não são iguais!');
        res.redirect('/profile');
        return;
    }
    //2. Procurar o usuário e mudar a senha dele
    req.user.setPassword(req.body.senha, async()=>{
        await req.user.save();

        req.flash('success', 'Senha alterada com sucesso!');
        res.redirect('/');
    });
    //3. Redirecionar para a HOME
}