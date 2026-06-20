//Appel package Mongoose et unique Validator
const mongoose = require('mongoose');
const uniqueValidator = require('mongoose-unique-validator');

const validateEmail = function(email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};
//Creation du modèle User via Mongoose 
const userSchema = mongoose.Schema({
    email: { type: String,
            trim: true,
            lowercase: true,
            unique: true,
            required: 'Email address is required',
            validate: [validateEmail, 'Please fill a valid email address'],
            match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, 'Please fill a valid email address'] },
    password: { type: String, required: true }
})
/*Mise en place du plugin Unique Validator 
afin de ne pas retrouver 2 utilisateurs ayant les mêmes identifiants*/ 
userSchema.plugin(uniqueValidator);

module.exports=mongoose.model('User', userSchema);