/**
 * Created by yaniv on 5/30/17.
 */
const {ObjectId} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

//remove - delete all records that match the filter
// Todo.remove({}).then((res) => {
//    console.log(res);
// });

//findOneAndRemove - remove the first document matching filter and returning it
// Todo.findOneAndRemove()


//findByIdAndRemove - same as above, but filter run by ID
Todo.findByIdAndRemove('592e6ad452ca86aadffc0cd7').then((todo) => {
   console.log(todo);
});