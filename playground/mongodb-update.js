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


    // MongoDB update operators:
    // https://docs.mongodb.com/manual/reference/operator/update/
    db.collection('Users').findOneAndUpdate({
        _id : new ObjectID('592963843f0fa736ca1b25ec')
    }, {
        $set : {
            name : 'Moran'
        },
        $inc : {
            age : 1
        }
    }, {
        returnOriginal : false
    }).then((res) => {
        console.log(`Updated object =  ${JSON.stringify(res,undefined, 2)}`);
    }).catch((e) => {
        console.log(`Error updating document =  ${JSON.stringify(e,undefined, 2)}`);
    });
});

