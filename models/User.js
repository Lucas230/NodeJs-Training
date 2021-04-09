const mongoose = require('mongoose');
const passportLocalMongoose = require('passport-local-mongoose');

mongoose.Promise = global.Promise;

const userSchema = new mongoose.Schema({
    nome: {
        type: String,
        trim: true,  
        required: 'O nome é obrigatório!'
    },
    userType: Number,
    email:{
        type: String,
        trim: true,
        required: 'O e-mail é obrigatório!'
    },
    celular:{
        type: String,
        trim: true,
        required: 'O celular é obrigatório!'
    },
    ra:{
        type: String,
        trim: true
    },
    senha:{
        type: String,
        required: 'A senha é obrigatória!'
    },
    cpf:{
        type: String,
        trim: true,
        required: 'O cpf é obrigatório!'
    },
    resetPasswordToken: String,
    resetPasswordExpires: Date
    
});

userSchema.plugin(passportLocalMongoose, {usernameField: 'email'});

module.exports = mongoose.model('User', userSchema);

