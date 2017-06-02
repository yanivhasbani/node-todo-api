/**
 * Created by yaniv on 6/2/17.
 */
const {User} = require('./../models/user');

//Middleware to autehnticate and change req with correct info from DB
var authenticate = (req, res, next) => {
    var token = req.header('x-auth');

    User.findByToken(token).then((user) => {
        if (!user) {
            //The catch below will catch this!
            console.log('No user');
            return Promise.reject();
        }

        req.user = user;
        req.token = token;
        next();
    }).catch((e) => {
        console.log('Error:', e);
        res.status(401).send();
    });
};

module.exports = {authenticate};