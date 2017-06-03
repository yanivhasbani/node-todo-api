/**
 * Created by yaniv on 6/2/17.
 */

const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId =  new ObjectID();
const userTwoId =  new ObjectID();
const users = [{
    _id : userOneId,
    email : 'yanivTest@yaniv.com',
    password : 'userOnePass',
    tokens : [ {
        access : 'auth',
        token: jwt.sign({_id: userOneId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}, {
    _id : userTwoId,
    email : 'moran@more.com',
    password : 'userTwoPass',
    tokens : [ {
        access : 'auth',
        token: jwt.sign({_id: userTwoId, access:'auth'}, process.env.JWT_SECRET).toString()
    }]
}];

const todos = [{
    text : 'First test to do',
    _id : new ObjectID(),
    _creator : userOneId
}, {
    text : 'Second test to do',
    _id : new ObjectID(),
    completed : true,
    completedAt : 333,
    _creator : userTwoId
}];

const populateTodos = (done) => {
    //Remove everything on Todo collection
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
};

const populateUsers = (done) => {
  User.remove({}).then(() => {
      var userOne = new User(users[0]).save();
      var userTwo = new User(users[1]).save();

      //Wait for all promises
      return Promise.all([userOne, userTwo]);
  }).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers};