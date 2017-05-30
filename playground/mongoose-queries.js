/**
 * Created by yaniv on 5/30/17.
 */
const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');


// var id = '592c979aef735b9f2b4c868e1';
//
// if(!ObjectId.isValid(id)) {
//     console.log(`Id not valid ${id}`);
// }

// Todo.find({
//     _id : id
// }).then((todos) => {
//    console.log(`Todos: ${todos}`);
// });
//
//
// //Return the first that matches the query
// Todo.findOne({
//    _id : id
// }).then((todo) => {
//     console.log(`Todo: ${todo}`);
// });

// Todo.findById(id).then((todo) => {
//     if (!todo) {
//         return console.log('Id not found');
//     }
//
//     console.log(`TodoById: ${todo}`);
// }).catch((e) => {
//     console.log(`Error: ${e}`);
// });

User.findById('592c61348909438c17709771').then((user) => {
    if (!user) {
        return console.log('Id not found on Users');
    }
    console.log(`UserById: ${JSON.stringify(user, undefined, 2)}`);
}).catch((e) => console.log(e));