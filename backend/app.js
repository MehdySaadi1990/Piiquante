const express = require('express');
const app = express();
const mongoose = require('mongoose');
const sauceRoute = require('./routes/sauces');
const userRoute = require('./routes/users');
const path = require('path');
//Connexion à la base de données en ligne
mongoose.connect('mongodb://localhost:27017/piiquante',
  { useNewUrlParser: true,
    useUnifiedTopology: true })
  .then(() => console.log('Connexion à MongoDB réussie !'))
  .catch(() => console.log('Connexion à MongoDB échouée !'));
//Mise en place des headers pour la gestion des CORS au niveau des requêtes POST et PUT  
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(express.json());
app.use('/api/sauces', sauceRoute);
app.use('/api/auth', userRoute);
app.use('/images', express.static(path.join(__dirname, 'images')));

  

module.exports = app;