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

    // deleteMany
    // db.collection('Todos').deleteMany({
    //    text : 'Gym'
    // }).then((res) => {
    //     console.log(res);
    // }, (err) => {
    //     console.log('Error in deleting many - ', err);
    // });

    // deleteOne
    // db.collection('Todos').deleteOne({
    //     text : 'Gym'
    // }).then((res) => {
    //     console.log(res);
    // },(err) => {
    //     console.log('Error in deleting one- ', err);
    // });

    // findOneAndDelete - delete the first one that matches and return it!
    // More info:
    // lastErrorObject -
    db.collection('Users').deleteMany({
        name : 'Yaniv Hasbani'
    }).then((res) => {

    }, (err) => {

    });

    db.collection('Users').findOneAndDelete({
        _id : new ObjectID('5929657ae2772b36dc865391')
    }).then((res) => {
        console.log(res);
    }, (err) => {
        console.log('Error in findOneAndDelete - ', err);
    });

    db.close();
});

