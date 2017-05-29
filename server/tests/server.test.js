/**
 * Created by yaniv on 5/29/17.
 */
let expect = require('expect');
let request = require('supertest');

const {app} = require('./../server')
const {Todo} = require('./../models/todo')

beforeEach((done) => {
    //Remove everything on Todo collection
    Todo.remove({}).then(() => done());
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

                Todo.find().then((todos) => {
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
                    expect(todos.length).toBe(0);
                    done();
                }).catch((e) => done(e));
            })
    });
});