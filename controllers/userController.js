const User = require('../models/User');
const crypto = require('crypto');
const mailHandler = require ('../handlers/mailHandler');

exports.login = (req, res) => {
    res.render('login')
};
exports.loginAction = (req, res) => {
    const auth = User.authenticate();
    auth(req.body.email, req.body.senha, (error, result) => {
        if (!result) {
            req.flash('error', 'Seu E-mail e/ou senha estão errados!');
            res.redirect('/users/login');
            return;
        }
        req.login(result, () => { });

        req.flash('success', 'Você foi logado com sucesso!');
        res.redirect('/');
    });
};

exports.register = (req, res) => {
    res.render('register');
};
exports.registerAction = (req, res) => {
    const newUser = new User(req.body);
    User.register(newUser, req.body.senha, (error) => {
        if (error) {
            req.flash('error', 'Ocorreu um erro, tente mais tarde.');
            res.redirect('/users/register');
            return;
        }
        req.flash('success', 'Usuário cadastrado com  sucesso!');
        res.redirect('/users/login');
    });
};

exports.logout = (req, res) => {
    req.logout();
    res.redirect('/');
};

exports.profile = (req, res) => {
    res.render('profile');
};

exports.profileAction = async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(
            { _id: req.user.id },
            {
                nome: req.body.nome,
                userType: req.body.userType,
                email: req.body.email,
                celular: req.body.celular,
                ra: req.body.ra,
                cpf: req.body.cpf,
            },
            { new: true, runValidators: true }
        );
    } catch (e) {
        req.flash('error', 'Ocorreu um erro!' + e.message);
        res.redirect('/profile');
        return;
    }
    req.flash('success', 'Dados atualizados com sucesso!');
    res.redirect('/profile');

};

exports.forget = (req, res) => {
    res.render('forget');
};

exports.forgetAction = async (req, res) => {
    //1. Verifica se o  usuário realmente existe
    const user = await User.findOne({ email: req.body.email }).exec();
    if (!user) {
        //A mensagem flash serve como um blefe para manter a segurança
        //req.flash('error','Um e-mail foi enviado a você.');
        req.flash('error', 'E-mail não cadastrado!');
        res.redirect('/users/forget');
        return;
    }
    //2. Gera um token (com data de expiração de uma hora) e salvar  no banco 

    //Podem ser chamados de qualquer nome
    user.resetPasswordToken = crypto.randomBytes(20).toString('hex');
    //Podem ser chamados de qualquer nome
    user.resetPasswordExpires = Date.now() + 3600000;//1 hora
    await user.save();

    //4. Gera o link e o envia por e-mail para o usuário
    const resetLink = `http://${req.headers.host}/users/reset/${user.resetPasswordToken}`;

    const html = `Testando email com o link:<br/><a href="${resetLink}">Recuperar senha</a>`;
    const text = `Testando o email com o link: ${resetLink}`;

    //Envio do email

    mailHandler.send({
        to:user.email,
        subject:'Recuperação de senha',
        html,
        text
    });
    req.flash('success', 'Te enviamos um e-mail com instruções');
    res.redirect('/users/login');
};

exports.forgetToken = async(req, res) => {
    //Verifica se o token existe e se é valido ele mostra o formulário para digitar a nova senha
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec();

    if (!user) {
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }

    res.render('forgetPassword');
};

exports.forgetTokenAction = async(req, res) => {
    //Verifica o token
    const user = await User.findOne({
        resetPasswordToken: req.params.token,
        resetPasswordExpires: { $gt: Date.now() }
    }).exec()
    if (!user) {
        req.flash('error', 'Token expirado!');
        res.redirect('/users/forget');
        return;
    }

    //Verifica se a senha no confirmar senha batem
    if(req.body.senha != req.body['senha-confirma']){
        req.flash('error', 'As senhas não são iguais!');
        //O back redireciona para a tela confimar 
        res.redirect('back');
        return;
    }

    user.setPassword(req.body.senha, async()=>{
        await user.save();
        req.flash('success', 'Senha alterada com sucesso!');
        res.redirect('/');
    });

};