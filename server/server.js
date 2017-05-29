/**
 * Created by yaniv on 5/29/17.
 */
var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

//Middleware - To make the res.body to become a JSON
app.use(bodyParser.json());

//Create a new todo
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

//Get all the todos from DB
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

app.listen(4001, () => {
   console.log('Started on port 4001');
});

module.exports = {app};

//URLS:
//Mongoose validators - http://mongoosejs.com/docs/validation.html
//Mongoose schemas - http://mongoosejs.com/docs/guide.html
