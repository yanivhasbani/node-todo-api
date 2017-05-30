/**
 * Created by yaniv on 5/29/17.
 */

//http://mongoosejs.com/docs/3.0.x/docs/guide.html
var mongoose = require('mongoose');

//Setting mongoose to work with Promise and not callbacks
mongoose.Promise = global.Promise;
//mongoose connect assure that even if you have a code
//That will be called before connect will finish,
//it will still work, event if the DB is not yet created!
var test = false
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/TodoApp');

module.exports = {
    mongoose
};