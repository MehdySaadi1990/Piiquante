//Appel Express pour création d'un routeur
const express = require('express');
//Création du routeur et appel du controller users
const router = express.Router();
const usersCtrl = require('../controllers/users');
//Création des routes et gestion des requêtes d'inscription et d'identification
router.post('/signup', usersCtrl.signup);
router.post('/login', usersCtrl.login);

module.exports= router;