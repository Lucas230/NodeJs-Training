// Nesse arquivo ficam as rotas prinsipais  do sistema

//importações
const express = require('express')
const homeController = require('../controllers/homeController')
const userController = require('../controllers/userController')
const postController = require('../controllers/postController')

//Definição das rotas
const router = express.Router()
router.get('/',  homeController.index)
router.get('/users/login', userController.login)
router.get('/users/register', userController.register)

router.get('/post/add', postController.add)
router.post('/post/add', postController.addAction)//vai enviar a requisição via post, conforme passada no form addPost.mst

router.get('/post/:slug/edit', postController.edit)
router.post('/post/:slug/edit', postController.editAction)

router.get('/post/:slug', postController.view)


module.exports = router 