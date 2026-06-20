//Récupération du modèle Sauce 
const Sauce = require('../models/sauces');
//Récupération du package file system
const fs = require('fs');
const { db } = require('../models/sauces');
//Fonction de création de Sauce (Attention : le userId sera récupéré via l'authentification)
exports.createSauce=(req, res, next)=>{
    const sauceObject = JSON.parse(req.body.sauce);
    delete sauceObject._id;
    delete sauceObject.userId;
        const sauce = new Sauce({
        ...sauceObject,
        userId: req.auth.userId,
        imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
        likes:0,
        dislikes:0
});
//Enregistrement de la sauce dans MongoDB
sauce.save()
.then(()=>res.status(201).json({message : 'sauce ajoutée'}))
.catch(error=>res.status(400).json({error}));
}
//Fonction affichage des sauces
exports.getAllSauces=(req, res, next)=>{
    Sauce.find()
    .then((sauces)=>res.status(200).json(sauces))
    .catch(error=>res.status(400).json({error}));
}
//Fonction d'accès à une sauce via l'ID
exports.getOneSauce=(req, res, next)=>{
    Sauce.findOne({
        _id : req.params.id
    })
    .then((sauce)=>res.status(200).json(sauce))
    .catch(error=>res.status(404).json({error}));
}
//Fonction suppression d'un sauce via l'ID
exports.deleteOneSauce=(req, res, next)=>{
    Sauce.findOne({_id : req.params.id})
    .then((sauce)=>{
        if(sauce.userId != req.auth.userId){
            res.status(401).json({objet : "Non-autorisé"})
        }
        else{
            /*Suppression de l'image du dossier images via la méthode unlink du package fs 
            puis suppression de l'objet de la base de donnée*/
            const fileName = sauce.imageUrl.split('/images/')[1];
                fs.unlink(`images/${fileName}`, ()=>{
                Sauce.deleteOne({_id : req.params.id})
                .then(()=>res.status(200).json({objet : "Sauce supprimée"}))
                .catch(error=>res.status(401).json({error}));
            })
        }
    } )
    .catch(error=>res.status(500).json({error}));
}
//Fonction de modification d'une sauce
exports.updateOneSauce=(req, res, next)=>{
    
    //Verification si le fichier existe ou non, si oui modification de l'URL de l'image dans l'objet sauce
    const sauceObject = req.file ? {
        ...JSON.parse(req.body.sauce),
        imageUrl : `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
    } : { ...req.body };
    //Suppression du userId, on utilisera celui de l'identification
    delete sauceObject._userId;
    /*Recherche d'un sauce via la methode findOne,
     si l'identification est correct, la modification peut être effectuée*/
    Sauce.findOne({_id : req.params.id})
    .then((sauce)=>{
        if(sauce.userId != req.auth.userId){
            res.status(401).json({objet : "Non-autorisé"})
        }
        else{
            /*Suppression de l'ancienne image dans le dossier images 
            puis mise a jour de la sauce avec les nouvelles informations dont la nouvelle image*/
            const fileName = sauce.imageUrl.split('/images/')[1];
            fs.unlink(`images/${fileName}`,()=>{
                Sauce.updateOne({ _id: req.params.id}, { ...sauceObject, _id: req.params.id})
            .then(() => res.status(200).json({message : 'Objet modifié!'}))
            .catch(error => res.status(401).json({ error }));
            })
            
        }
    })
    .catch(error=>res.status(400).json({error}));
}
//Fonction attribution de like et de dislikes
exports.likeOrDislikeSauce=(req, res, next)=>{
            const like = req.body.like;
            const userId = req.body.userId;
            //Gestion de l'erreur à l'envoi d'un like
            if(![-1,0,1].includes(like))return res.status(403).json({message:"Invalid Value"});
                if(like==1){
                    /*Mise a jour des likes dans la base de données 
                    et insertion du userID dans le tableau userLiked de la base de données*/ 
                    Sauce.updateOne({ _id: req.params.id}, 
                        {$inc:{likes:1}, $push:{usersLiked:req.auth.userId}})
                    .then(() =>res.status(200).json({message: "Like Ajouté"}))
                    .catch(error => res.status(500).json({ error }));
                    }
                    /*Mise a jour des dislikes dans la base de données 
                    et insertion du userID dans le tableau userDisiked de la base de données*/
                    if(like==-1){
                        Sauce.updateOne({ _id: req.params.id}, 
                            {$inc:{dislikes:1}, $push:{usersDisliked:req.auth.userId}})
                        .then(() =>res.status(200).json({message: "Dislike Ajouté"}))
                        .catch(error => res.status(500).json({ error }));
                    }
                    //Gestion du retrait de vote
                    if(like==0){
                        Sauce.findOne({_id : req.params.id})
                        .then((sauce)=>{
                            if(sauce.usersLiked.includes(req.body.userId)){
                                Sauce.updateOne({ _id: req.params.id}, 
                                    {$inc:{likes:-1}, $pull:{usersLiked:req.auth.userId}})
                                .then(() =>res.status(200).json({message: "Like Suppprimé"}))
                                .catch(error => res.status(500).json({ error }));
                            }
                            if(sauce.usersDisliked.includes(req.body.userId)){
                                Sauce.updateOne({ _id: req.params.id}, 
                                    {$inc:{dislikes:-1}, $pull:{usersDisliked:req.auth.userId}})
                                .then(() =>res.status(200).json({message: "Dislike Suppprimé"}))
                                .catch(error => res.status(500).json({ error }));
                            }
                        })
                    }
            }
            
    
