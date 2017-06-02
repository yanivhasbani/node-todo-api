/**
 * Created by yaniv on 5/29/17.
 */
const mongoose = require('mongoose');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const _ = require('lodash');
const bcrypt = require('bcryptjs');

var UserSchema = new mongoose.Schema({
    email : {
        type : String,
            required : true,
            trim : true,
            minlength : 1,
            //Every document in the collection will need to have a unique email
            unique : true,
            //custom email validation
            validate: {
                isAsync: true,
                //EC6 way of declaring the method that will be called with the value!
                validator : validator.isEmail,
                //Error message
                //{VALUE} - the actual value given
                message : '{VALUE} is not a valid email'
            }
    },
    password : {
        type : String,
            required : true,
            minlength: 6
    },
    //Syntax that mongoose has for tokens!
    tokens : [{
        access : {
            type : String,
            //Note: this required is with regards to his obeject - meaning a user.
            //This does not say that tokens cannot be empty!
            required : true
        },
        token : {
            type : String,
            required : true
        }
    }]
});

//Add instance method - done with Schemas!
//We are using function and not arrow because we need the this object

//This function is the converter of object to JSON
//We do this to make sure the returned object from POST user
//is returned with only the email(without password+token)
UserSchema.methods.toJSON = function () {
    var user = this;
    //Converting mongoose object to JS objects.
    //The properties returned are specified in the Schema and validate against it
    var userObject = user.toObject();

    return _.pick(userObject, ['_id', 'email']);
};

UserSchema.methods.generateAuthToken = function () {
    var user = this;
    var access = 'auth';
    var token = jwt.sign({_id : user._id.toString(), access}, 'abc123').toString();

    user.tokens.push({access, token});

    //returning a promise BY VALUE, allowing chaining to whom every calls this!
    return user.save().then(() => {
        return token;
    });
};


//Model methods(Class methods)
UserSchema.statics.findByToken = function(token) {
    console.log('Token', token);
    var User = this;
    var decoded;

    try {
        decoded = jwt.verify(token, 'abc123');
        console.log('Decode', decoded);
    } catch (e) {
        console.log('Error:', e);
        //Create a new promise and reject it automatically.
        //That way, if there is a catch on what is calling this
        //it will receive an error because of this reject!
        return Promise.reject();
    }

    return User.findOne({
        '_id' : decoded._id,
        //Nested query - Tokens is an array!
        'tokens.token' : token,
        'tokens.access' : 'auth'
    });
};

//Mongoose middleware
UserSchema.pre('save', function (next) {
    var user = this;

    //Check if the property was modified, adn return true only if it was
    if (user.isModified('password')) {
        var password = user.password;
        bcrypt.genSalt(10, (err, salt) => {
            if (!err) {
                bcrypt.hash(password, salt, (err, hash) => {
                    if (!err) {
                        user.password = hash;
                        next();
                    } else {
                        return Promise.reject(err);
                    }
                })
            } else {
                return Promise.reject(err);
            }
        });
    } else {
        next();
    }
});

var User = mongoose.model('Users', UserSchema);

module.exports = {
    User
};