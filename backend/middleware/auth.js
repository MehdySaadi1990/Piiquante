const jwt = require('jsonwebtoken');
/*Fonction de récupération et de décodage du Token via la méthode verify,
 création requête d'authentification en utilisant le token décodé comme userID*/
module.exports = (req, res, next)=>{
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'RANDOM_TOKEN_SECRET');
        const userId= decodedToken.userId;
        req.auth = {
            userId:userId
        };
        next();
    }
    catch(error){
        res.status(401).json({error})
    }
};