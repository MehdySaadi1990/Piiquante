//Appel Express pour création d'un routeur
const express = require('express');
//Création d'un routeur et appel des différents middlewares et controlleurs pour gestion des requêtes
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');
const saucesCtrl = require('../controllers/sauces');
//Création des routes et gestion des requêtes
router.post('/', auth, multer, saucesCtrl.createSauce);
router.get('/', auth, saucesCtrl.getAllSauces);
router.get('/:id',auth, saucesCtrl.getOneSauce);
router.delete('/:id', auth, saucesCtrl.deleteOneSauce);
router.put('/:id', auth, multer, saucesCtrl.updateOneSauce);
router.post('/:id/like', auth, saucesCtrl.likeOrDislikeSauce);


module.exports= router;