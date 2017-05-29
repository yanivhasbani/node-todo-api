/**
 * Created by yaniv on 5/29/17.
 */
var mongoose = require('mongoose');

//mongoose model - create a model with properties definition
var Todo = mongoose.model('Todo', {
    text : {
        //Type is not enforced - coversions will be called in case of Number => String!
        type : String,
        required : true,
        minlength : 1,
        //Removing leading/trailing whitespaces
        trim : true
    },
    completed : {
        type : Boolean,
        //default value
        default : false
    },
    completedAt : {
        type : Number,
        default : null
    }
});

module.exports = {
    Todo
};