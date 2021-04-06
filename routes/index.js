// Nesse arquivo ficam as rotas prinsipais  do sistema

//importações
const express = require('express');
const homeController = require('../controllers/homeController');
const userController = require('../controllers/userController');
const postController = require('../controllers/postController');
const authMiddleware = require('../middlewares/authMiddleware');
const imageMiddleware = require('../middlewares/imageMiddleware');

//Definição das rotas
const router = express.Router();
router.get('/', homeController.index);
router.get('/users/login', userController.login);
router.post('/users/login', userController.loginAction);
router.get('/users/logout', userController.logout);

router.get('/users/register', userController.register);
router.post('/users/register', userController.registerAction);

router.get('/post/add', authMiddleware.isLogged, postController.add);
router.post('/post/add',
    authMiddleware.isLogged,
    imageMiddleware.upload,
    imageMiddleware.resize,
    postController.addAction);//vai enviar a requisição via post, conforme passada no form postAdd.mst

router.get('/post/:slug/edit', authMiddleware.isLogged, postController.edit);
router.post('/post/:slug/edit', authMiddleware.isLogged, postController.editAction);

router.get('/post/:slug', postController.view);


module.exports = router;