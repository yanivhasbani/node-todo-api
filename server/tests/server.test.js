/**
 * Created by yaniv on 5/29/17.
 */
let expect = require('expect');
let request = require('supertest');
let {ObjectID} = require('mongodb');

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

const todos = [{
    text : 'First test to do',
    _id : new ObjectID()
}, {
    text : 'Second test to do',
    _id : new ObjectID()
}];

beforeEach((done) => {
    //Remove everything on Todo collection
    Todo.remove({}).then(() => {
        Todo.insertMany(todos);
    }).then(() => done());
});

describe('Post /todos', () => {
   it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            //supertest will convert the object to JSON
            .send({text})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find({text}).then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toBe(text);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should not create a new todo', (done) => {
        request(app)
            .post('/todos')
            //supertest will convert the object to JSON
            .send({})
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((e) => done(e));
            })
    });
});


describe('GET /todos', () => {
    it('should GET all todos', (done) => {
        request(app)
            .get('/todos')
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(2);
            })
            .end(done)
    });
});


describe('GET /todos/:id', () => {
    it('should GET the correct todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id.toString()).toEqual(todos[0]._id.toString());
                expect(res.body.todo.text).toEqual(todos[0].text);
            })
            .end(done)
    });

    it('should GET an error because of a invalid ObjectID', (done) => {
        request(app)
            .get(`/todos/123`)
            .expect(404)
            .expect((res) => {
                expect(!res.body.todo);
            })
            .end(done)
    });

    it('should GET an error because of todo not found', (done) => {
        request(app)
            .get(`/todos/592d849dde3a14a396fbbb20`)
            .expect(404)
            .expect((res) => {
                expect(!res.body.todo);
            })
            .end(done)
    });
});


describe('DELETE /todos/:id', () => {
    it('should DELETE existing todo from collection', (done) => {
        var id = todos[1]._id.toString();
        console.log(`/todos/${id}`);
        request(app)
            .delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toEqual(todos[1].text);
            })
            .end((res, err) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExists();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Invalid ID on DELETE should result in 404', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toString() + '444'}`)
            .expect(404)
            .expect((res) => {
                expect(!res.body)
            })
            .end(done)
    });

    it('Non existing ID on DELETE should result in 404', (done) => {
        id = todos[0]._id.toString();
        id = id.substr(0,id.length - 1) + 'j';
        request(app)
            .delete(`/todos/${id}`)
            .expect(404)
            .expect((res) => {
                expect(!res.body)
            })
            .end(done)
    });
});