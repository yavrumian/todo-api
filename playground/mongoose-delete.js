const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.deleteMany({}).then((result) => {
// 	console.log(result);
// });

Todo.findOneAndDelete({_id: new ObjectID('5bc099efe2690d8d30f87602')}).then((result) =>{ 
	console.log( "fuckintext", result);
})