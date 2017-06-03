/**
 * Created by yaniv on 5/29/17.
 */
let expect = require('expect');
let request = require('supertest');
let {ObjectID} = require('mongodb');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');


beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {
   it('should create a new todo', (done) => {
        var text = 'Test todo text';

        request(app)
            .post('/todos')
            .set({'x-auth' : users[0].tokens[0].token})
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
            .set({'x-auth' : users[0].tokens[0].token})
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
            .set({'x-auth' : users[0].tokens[0].token})
            .expect(200)
            .expect((res) => {
                expect(res.body.todos.length).toBe(1);
            })
            .end(done)
    });
});

describe('GET /todos/:id', () => {
    it('should GET the correct todo by id', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .set({'x-auth' : users[0].tokens[0].token})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id.toString()).toEqual(todos[0]._id.toString());
                expect(res.body.todo.text).toEqual(todos[0].text);
            })
            .end(done)
    });

    it('should not GET a todo doc created by other user', (done) => {
        request(app)
            .get(`/todos/${todos[0]._id.toString()}`)
            .set({'x-auth' : users[1].tokens[0].token})
            .expect(404)
            .end(done)
    });

    it('should GET a 404 because of a invalid ObjectID', (done) => {
        request(app)
            .get(`/todos/123`)
            .set({'x-auth' : users[0].tokens[0].token})
            .expect(404)
            .expect((res) => {
                expect(!res.body.todo);
            })
            .end(done)
    });

    it('should GET a 404 because of todo not found', (done) => {
        request(app)
            .get(`/todos/592d849dde3a14a396fbbb20`)
            .set({'x-auth' : users[0].tokens[0].token})
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
            .set({'x-auth' : users[1].tokens[0].token})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toEqual(todos[1].text);
            })
            .end((err,res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toNotExist();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should not DELETE existing todo of other user', (done) => {
        var id = todos[1]._id.toString();
        console.log(`/todos/${id}`);
        request(app)
            .delete(`/todos/${id}`)
            .set({'x-auth' : users[0].tokens[0].token})
            .expect(404)
            .end((err,res) => {
                if (err) {
                    return done(err);
                }

                Todo.findById(id).then((todo) => {
                    expect(todo).toExist();
                    done();
                }).catch((e) => done(e));
            })
    });

    it('Invalid ID on DELETE should result in 404', (done) => {
        request(app)
            .delete(`/todos/${todos[0]._id.toString() + '444'}`)
            .set({'x-auth' : users[1].tokens[0].token})
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
            .set({'x-auth' : users[1].tokens[0].token})
            .expect(404)
            .expect((res) => {
                expect(!res.body)
            })
            .end(done)
    });
});

describe('PATCH /todos/:id ', () => {
    it('Correct UPDATE to first element', (done) => {
        id = todos[0]._id.toString();
        request(app)
            .patch(`/todos/${id}`)
            .set({'x-auth' : users[0].tokens[0].token})
            .send({ text : 'text',
                    completed: true})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('text');
                expect(res.body.todo.completed).toBe(true);
                expect(res.body.todo.completedAt).toBeA('number');
            })
            .end(done);
    });

    it('Don\'t UPDATE first element of other user', (done) => {
        id = todos[0]._id.toString();
        request(app)
            .patch(`/todos/${id}`)
            .set({'x-auth' : users[1].tokens[0].token})
            .send({ text : 'text',
                completed: true})
            .expect(404)
            .end((err) => {
                if (err) {
                    return done(err);
                }

                Todo.findOne({
                    _id : id,
                    _creator : users[0]._id
                }).then((todo) => {
                    expect(todo.text).toNotBe('text');
                    expect(todo.completed).toNotBe(true);
                    expect(todo.completedAt).toNotExist();
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should clear completedAt when todo is not completed', (done) => {
        id =  todos[1]._id.toString();
        request(app)
            .patch(`/todos/${id}`)
            .set({'x-auth' : users[1].tokens[0].token})
            .send({text: 'text', completed: false})
            .expect(200)
            .expect((res) => {
                expect(res.body.todo.text).toBe('text');
                expect(res.body.todo.completed).toBe(false);
                expect(res.body.todo.completedAt).toNotExist();
            })
        .end(done);
    });

});

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set({'x-auth' : users[0].tokens[0].token})
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toString());
                expect(res.body.email).toBe(users[0].email);
            })
        .end(done);
    });

    it('should return 401 if not authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set({'x-auth' : {}})
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({});
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a new user', (done) => {
        var email = 'yaniv123@yaniv.com';
        var password = '123poi123';
        request(app)
            .post('/users')
            .send({email: email, password: password})
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
                expect(res.body._id).toExist();
                expect(res.body.email).toBe(email);
            })
            .end((err) => {
                if (err) {
                    return done(err);
                }
                User.findOne({email : email}).then((user) => {
                    expect(user.password).toNotBe(password)
                    expect(user._id).toExist();
                    expect(user.email).toBe(email);
                    done();
                }).catch((e) => done(e));
            });
    });

    it('should return validation error for incorrect email', (done) => {
        request(app)
            .post('/users')
            .send({email : 'yyy', password : 'password'})
            .expect(400)
            .end(done);
    });

    it('should return validation error for too short password', (done) => {
        request(app)
            .post('/users')
            .send({email : 'yyy@yaniv.com', password : '111'})
            .expect(400)
            .end(done);
    });

    it('should return validation error for ununique email', (done) => {
        request(app)
            .post('/users')
            .send({email : 'yanivTest@yaniv.com', password : '111'})
            .expect(400)
            .end(done);
    });
});

describe('POST /users/login', () => {
    it('should login user and return auth token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password,
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email : users[1].email}).then((user) => {
                    expect(user.tokens[1]).toInclude({
                        access : 'auth',
                        token: res.headers['x-auth']
                    });
                    expect(user.email).toBe(users[1].email);
                    done();
                }).catch((e) => done(e));
            })
    });

    it('should reject invalid login', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email : users[1].email,
                password : users[1].password + '1'
            })
            .expect(400)
            .expect((res) => {
                expect(res.headers['x-auth']).toNotExist();
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email : users[1].email}).then((user) => {
                    expect(user.tokens.length).toBe(1);
                    done();
                }).catch((e) => done(e));
            });
    });
});

describe('DELETE /users/me/token', () => {
   it('should remove auth token on logout', (done) => {
       request(app)
           .delete('/users/me/token')
           .set({'x-auth' : users[0].tokens[0].token})
           .expect(200)
           .end((err, res) => {
                if (err) {
                    return done(err);
                }

                User.findOne({email : users[0].email}).then((user) => {
                    if (!user) {
                        return new Error('No users where found').throw();
                    }
                    expect(user.email).toBe(users[0].email);
                    expect(user.tokens.length).toBe(0);
                    done();
                }).catch((e) => done(e));
           });
   });
});