require('./config/config.js')
const _ = require('lodash');
const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const bcrypt = require('bcryptjs');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var app = express();
const port = process.env.PORT;

//Middleware
//To make the res.body to become a JSON
app.use(bodyParser.json());

//POST a new todo
app.post('/todos', (req, res) => {
   var todo = new Todo({
      text : req.body.text
   });
   todo.save().then((doc) => {
      console.log(`Succesfully saved todo = ${doc}`);
      res.send(doc);
   }, (e) => {
      console.log(`Error saving a new todo to DB. ${e}`);
      res.status(400).send(e);
   });
});

//GET all the todos from DB
app.get('/todos', (req, res) => {
   Todo.find().then((todos) => {
      console.log(`Succesfully got all todos = ${JSON.stringify(todos, undefined, 2)}`);
      //No need to add status here as 200 is the default!
      res.send({todos});
   }, (e) => {
      console.log(`Error fetching todos from database. err = ${e}`);
      res.status(400).send(e);
   });
});

//GET specific todo by id - URL parameter
app.get('/todos/:id', (req, res) => {
   //get :id from url - req.params is a dictionary
   var id = req.params.id;

   if (!ObjectID.isValid(id)) {
      console.log('Invalid id');
      return res.status(404).send({});
   }

   Todo.findById(id).then((todo) => {
      if (!todo) {
         console.log(('No todo with that specific ID'));
         return res.status(404).send({});
      }
      console.log((`Returning ${todo}`));
      res.send({todo});
   }).catch((e) => {
      console.log((`Error in fetching todo by id`));
      res.status(400).send({});
   })
});

//DELETE specific todo by id
app.delete('/todos/:id', (req, res) => {
   var id = req.params.id;
   if (!ObjectID.isValid(id)) {
      console.log('Invalid id');
      return res.status(404).send({});
   }

   Todo.findByIdAndRemove(id).then((todo) => {
      if (!todo) {
         console.log(`ID ${id} does not match any item on DB`);
         return res.status(404).send();
      }
      res.send({todo});
   }).catch((e) => {
      console.log(`Error in removing id = ${id}. Err = ${e}`);
      res.status(400).send();
   })
});

//PATCH specific todo by id
app.patch('/todos/:id', (req, res) => {
   var id = req.params.id;
   //Pick the propertis you with out of a dictionary and returns those only!
   var body = _.pick(req.body, ['text', 'completed']);
   if (!ObjectID.isValid(id)) {
      console.log('Invalid id on patch request');
      return res.status(404).send();
   }

   if (_.isBoolean(body.completed) && body.completed) {
      console.log('Got completed true');
      body.completedAt = new Date().getTime();
   } else {
      body.completed = false;
      body.completedAt = null;
   }

   Todo.findByIdAndUpdate(id, {
      $set : body
   }, {
      new : true
   }).then((todo) => {
      if (!todo) {
         console.log(`No item on DB with id ${id}`);
         return res.status(404).send();
      }

      return res.send({todo});
   }).catch((e) => {
      console.log(`Error: ${e}`);
      return res.status(400).send();
   });
});

//POST a new user
app.post('/users', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   if (!body.email || !body.password) {
      return res.status(404).send('No email or password were supplied');
   }

   var user = new User(body);

   user.save().then((user) => {
      return user.generateAuthToken();
   }).then((token) => {
      // This then is generated from the value promised
      // returned from generateAuthToken!
      if (!token) {
         return res.status(404).send();
      }

      //x- is the standard for custom header in HTTP
      res.header('x-auth', token).send(user);
   }).catch((e) => {
      return res.status(400).send(e)
   });
});

//This route is called with a middleware authenticate
app.get('/users/me', authenticate, (req, res) => {
   res.send(req.user);
});

//POST request for login
app.post('/users/login', (req, res) => {
   var body = _.pick(req.body, ['email', 'password']);
   if (!body.email || !body.password) {
      return res.status(404).send('No email or password were supplied');
   }

   User.findByCredentials(body.email, body.password).then((user) => {
      user.generateAuthToken().then((token) => {
         // This then is generated from the value promised
         // returned from generateAuthToken!
         if (!token) {
            return res.status(404).send();
         }

         //x- is the standard for custom header in HTTP
         res.header('x-auth', token).send(user);
      });
   }).catch((e) => {
      res.status(400).send()
   });
});

app.delete('/users/me/token', authenticate, (req, res) => {
   req.user.removeToken(req.token).then(() => {
      res.status(200).send();
   }, () => {
      res.status(400).send();
   });
});


//Open port
app.listen(port, () => {
   console.log(`Started on port ${port}`);
});

module.exports = {app};

//NPM
//Email validator - https://www.npmjs.com/package/validator

//URLS:
//Mongoose validation - http://mongoosejs.com/docs/validation.html
//Mongoose schemas - http://mongoosejs.com/docs/guide.html
//Mongoose middleware - http://mongoosejs.com/docs/middleware.html

//Heroku
//https://elements.heroku.com/addons/mongolab
