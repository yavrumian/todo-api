const {ObjectId} = require('mongodb');
const jwt = require('jsonwebtoken')

const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');

const userOneId = new ObjectId();
const userTwoId = new ObjectId();
const users = [{
	_id: userOneId,
	email: 'valid@email.com',
	password: 'validpassword',
	tokens: [{
		access: 'auth',
		token: jwt.sign({_id: userOneId, access: 'auth'}, 'secretCode').toString()
	}]
},{
	_id: userTwoId,
	email: 'valid@email.ru',
	password: 'validpassword'
}]

const todos = [{
	_id: new ObjectId(),
	text: 'Frst tod',
	_creator: userOneId
}, {
	_id: new ObjectId(),
	text: '2nd todo',
	completed: true,
	completedAt: 1458,
	_creator: userTwoId
}];

const populateTodos = (done) => {
	Todo.deleteMany({}).then(() => {
		return Todo.insertMany(todos)
	}).then(() => done());
};

const populateUsers = (done) => {
	User.deleteMany({}).then(() => {
		var userOne = new User(users[0]).save();
		var userTwo = new User(users[1]).save();

		return Promise.all([userOne, userTwo])
	}).then(() => done());
};

module.exports = {todos, populateTodos, users, populateUsers}