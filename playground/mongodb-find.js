//http://mongodb.github.io/node-mongodb-native/2.2/api/

const {MongoClient, ObjectID} = require('mongodb');

//Object de-structuring - getting a property from obejct easily
var user = {name: "Yaniv", age : 32};
var {name} = user; //Get the value of a property named name from user

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, db) => {
    if (err) {
        return console.log('Unable to connect to MongoDB server');
    }
    console.log('Connected to MongoDB server');

    //find returns a cursor not array!
    //http://mongodb.github.io/node-mongodb-native/2.2/api/Cursor.html
    //toArray() will mutate that to an array

    // db.collection('Todos').find({
    //     //_id search is done by ObjectID, not string!
    //     _id : new ObjectID('59295db1fb0123366f378dbc')
    // }).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined, 2));
    // }, (err) => {
    //     console.log('Unable to fetch Todos', err);
    // });

    db.collection('Users').find({
        name : 'Yaniv Hasbani'
    }).toArray().then((docs) => {
        console.log(JSON.stringify(docs, undefined, 2));
    }, (err) => {
        console.log('Unable to fetch Todos', err);
    });

    db.close();
});

