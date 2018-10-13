const expect = require('expect');
const request = require('supertest');
const {ObjectId} = require('mongodb')

const {app} = require('./../server');
const {Todo} = require('./../models/todo');

const todos = [{
	_id: new ObjectId(),
	text: 'Frst tod'
}, {
	_id: new ObjectId(),
	text: '2nd todo',
	completed: true,
	completedAt: 1458
}];

beforeEach((done) => {
	Todo.deleteMany({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
});

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