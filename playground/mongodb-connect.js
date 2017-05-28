// const MongoClient = require('mongodb').MongoClient;
const {MongoClient, ObjectID} = require('mongodb');

// //Creating our own Mongo objectId
// var obj = new ObjectID();
// console.log(obj);

//Object de-structuring - getting a property from obejct easily
var user = {name: "Yaniv", age : 32};
var {name} = user; //Get the value of a property named name from user

//If MongoDB does not exists, you can still connect to it!
//Mongo will only create the DB once you put data into it(lazy)
MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //Mongo collections are lazy instantiated

    //Adding a Todos collection
    // db.collection('Todos').insertOne({
    //     text : 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo\n', err);
    //     }
    //
    //     //result.ops will store all the document added
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });
    //
    // db.collection('Users');

    // db.collection('Users').insertOne({
    //     name : 'Yaniv Hasbani',
    //     age: false,
    //     location : 'Israel'
    // }, (err, result) => {
    //     if (err) {
    //         return console.log('Unable to insert todo\n', err);
    //     }
    //     //Pull the timestamp from the creation of the object
    //     console.log(result.ops[0]._id.getTimestamp());
    //     //result.ops will store all the dotcument added
    //     console.log(JSON.stringify(result.ops, undefined, 2));
    // });

    db.close();
});

//MongoDB

/*default _id:
    A unique 12 bytes id, autocreated by Mongo:

   [0-3] bytes - timestamp when the id was created
   [4-6] bytes - machine identifier to uniquify by machin
   [7-8] bytes - processID that created
   [9-11] bytes - counter
 */