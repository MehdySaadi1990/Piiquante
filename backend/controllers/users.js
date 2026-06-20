//Récupération du package de chiffrement bcrypt 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
//Récupération modèle objet Utilisateur
const User = require('../models/users');
//Fonction d'enregistrement d'un utilisateur
exports.signup = (req, res, next) => {
    //Méthode Hash de bcrypt permettant le salage du mot de passe à 10 reprises
    bcrypt.hash(req.body.password,10)
    .then(hash=>{
        const user = new User({
            email : req.body.email,
            password : hash
         })
    //Enregistement du nouvel utilisateur dans la base de donnée
    user.save()
    .then(()=>res.status(201).json({message : 'utilisateur ajouté'}))
    .catch(error=>res.status(400).json({error}));
    })
    .catch(error=>res.status(500).json({error}));
};
//Fonction identification utilisateur enregistré
exports.login = (req, res, next) => {
    //Recherche de l'utilisateur via l'email de la requête dans la base de données
    User.findOne({email : req.body.email})
    .then(user=>{
        if(!user){
            return res.status(401).json({message : "Paire login/mdp incorrect"})
        }
        //Comparaison des mots de passes par bcrypt 
        else{
            bcrypt.compare(req.body.password, user.password)
            .then(valid=>{
                if(!valid){
                    return res.status(401).json({message : "Paire login/mdp incorrect"})
                    }
                    /*Attribution d'un TOKEN via jsonwebtoken 
                    d'une durée de 24h pour toute nouvelle authentification*/
                    else{
                        return res.status(200).json({
                            userId:user._id,
                            token: jwt.sign(
                            {userId:user._id},
                            'RANDOM_TOKEN_SECRET',
                            {expiresIn: '24h'}
                            )})
                    }
                    
                })
                .catch(error=>res.status(500).json({error}));
        }
        
    })
    .catch(error=>res.status(500).json({error}));
};