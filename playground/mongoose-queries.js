const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {ObjectID} = require('mongodb');
const {User} = require('./../server/models/user');

var id = '5bbf12cc86a84210f1478200';

// if(!ObjectID.isValid(id)) {
// 	console.log('ID is not valid')
// }

// Todo.find({
// 	_id: id
// }).then((todos) => {
// 	console.log(todos)
// });

// Todo.findOne({
// 	_id: id
// }).then((todo) => {
// 		console.log('find oune', todo);
// });

// Todo.findById(id).then((todo) => {
// 	if(!todo) return console.log('Id not found')
// 	console.log(todo)
// }).catch((e) => console.log(e))

User.findById(id)
	.then((user) => {
		if(!user) return console.log("ID is not found");
		console.log(user.email)
	}, (e) => {
		console.log(e.message)
	})