const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');
const {User} = require('./../models/user');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
	it('create new todo', (done) => {
		var text = 'Testing text';
			request(app)
			.post('/todos')
			.send({text})
			.expect(200)
			.expect((res) => {
				expect(res.body.text).toBe(text);
			})
			.end((err, res) => {
				if(err){
					return done(err);	
				} 
				Todo.find({text}).then((todos) => {
					expect(todos.length).toBe(1);
					expect(todos[0].text).toBe(text);
					done();
				}).catch((e) => done(e));
			})
	});

	it('not create with invalid data', (done) => {
		request(app)
			.post('/todos')
			.send({})
			.expect(400)
			.end((err, res) => {
				if(err) return done(err);

				Todo.find().then((todos) => {
					expect(todos.length).toBe(2);
					done()
				}).catch((e) => done(e));
			});
	});
});

describe('GET /todos', () => {
	it('Should get all todos', (done) => {
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
	it('Should return todo todo', (done) => {
		request(app)
			.get(`/todos/${todos[0]._id.toHexString()}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(todos[0].text)
			})
			.end(done)
	});
	it('Should return 404 if todo is not found', (done) => {
		var id = new ObjectId();
		request(app)
			.get(`/todos/${id.toHexString()}`)
			.expect(404)
			.end(done)
	});
	it('Should return 404 if ID is not valid', (done) => {
		request(app)
			.get('/todos/125')
			.expect(404)
			.end(done)
	});
});

describe('DEL /todos/:id', () =>{
	it('should remove a todo', (done)=> {
		var hexId = todos[1]._id.toHexString();

		request(app)
			.delete(`/todos/${hexId}`)
			.expect(200)
			.expect((res) => {
				expect(res.body.todo._id).toBe(hexId);
			})
			.end((err, res) => {
				if(err) return done(err);

				Todo.findById(hexId).then((todo) => {
					expect(todo).toBeFalsy();
					done()	
				}).catch((e) => done(e));
				
			});
	});
	it('should return 404 if todo is not found', (done) => {
		var id = new ObjectId();
		request(app)
			.delete(`/todos/${id.toHexString()}`)
			.expect(404)
			.end(done)
	});
	it('should return 404 if ObjectID is invalid', (done)=> {
		request(app)
			.delete('/todos/125')
			.expect(404)
			.end(done)
	})
});

describe('PATCH /todos/:id', () => {
	it('should update the todo', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "Updated shit";
		request(app)
			.patch(`/todos/${hexId}`)
			.send({text, completed: true})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(true);
				expect(typeof res.body.todo.completedAt).toBe('number')
			})
			.end(done)
	});
	it('should clear completedAt', (done) => {
		var hexId = todos[0]._id.toHexString();
		var text = "Updated shit";
		request(app)
			.patch(`/todos/${hexId}`)
			.send({text, completed: false})
			.expect(200)
			.expect((res) => {
				expect(res.body.todo.text).toBe(text);
				expect(res.body.todo.completed).toBe(false);
				expect(res.body.todo.completed).toBeFalsy()
			})
			.end(done)
	})
});

describe('GET /usrs/me', () => {
	it('should return user id authenticated', (done) => {
		request(app)
			.get('/users/me')
			.set('x-auth', users[0].tokens[0].token)
			.expect(200)
			.expect((res) => {
				expect(res.body._id).toBe(users[0]._id.toHexString());
				expect(res.body.email).toBe(users[0].email);
			})
			.end(done)
	});

	it('should return 401 if not authenticated', (done) => {
		request(app)
			.get('/users/me')
			.expect(401)
			.expect((res) => {
				expect(res.body).toEqual({});
			})
			.end(done)
	})
});

describe('POST /users', () => {
	it('Should create a user', (done) =>{
		var email = 'example@mail.com',
			password = 'validpass';

		request(app)
			.post('/users')
			.send({email, password})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy()
				expect(res.body._id).toBeTruthy();
				expect(res.body.email).toBe(email);
			})
			.end((err) => {
				if(err) return done(err);

				User.findOne({email}).then((user) =>{
					expect(user).toBeTruthy();
					expect(user.password).not.toBe(password);
					done()
				}).catch((e) => done(e))
			});
	})

	it('Should return 400 if request is invalid', (done) =>{
		request(app)
			.post('/users')
			.send({email: "text", password: "text"})
			.expect(400)
			.end(done)

	})

	it('should not create user if email is in use', (done) =>{
		request(app)
			.post('/users')
			.send({email: users[0].email, password: 'validpass'})
			.expect(400)
			.end(done)
	})
});

describe('POST /users/login', () => {
	it('Should login user and return auth token', (done) => {
		request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: users[1].password
			})
			.expect(200)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeTruthy();
			})
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens[0]).toMatchObject({
						access: 'auth',
						token: res.headers['x-auth']
					});
					done()
				}).catch((e) => {
					done(e)
				})
			})
	});

	it('should reject invalid login', (done) => {
			request(app)
			.post('/users/login')
			.send({
				email: users[1].email,
				password: 'InvalidPAss'
			})
			.expect(400)
			.expect((res) => {
				expect(res.headers['x-auth']).toBeFalsy();
			})
			.end((err, res) => {
				if (err) return done(err);
				User.findById(users[1]._id).then((user) => {
					expect(user.tokens.length).toBe(0);
					done()
				}).catch((e) => {
					done(e)
				})  
			})
	})
})