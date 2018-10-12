const express = require('express');
const bodyParser = require('body-parser')
const {ObjectID} = require('mongodb');

const {mongoose} = require('./db/mongoose.js')
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

const port = process.env.PORT || 8080;
var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
	new Todo({
		text: req.body.text
	})
	.save()
	.then((doc)=>{
		res.send(doc)
	}, (e) => {
		res
		.status(400)
		.send(e)
	});
});

app.get('/todos', (req, res) => {
	Todo.find().then((todos) => {
		res.send({todos})
	}, (e) => {
		res.status(400).send(e)
	})
});

app.get('/todos/:id', (req,res) => {
	var id = req.params.id;
	if(!ObjectID.isValid(id)) {
		res.status(404).send({});
		return console.log('ID is invalid');
	}
	Todo.findById(id).then((todo) => {
		if(!todo) return res.status(404).send('No todo is found');
		res.send({todo});
	}).catch((e) => res.status(404).send())
});

app.listen(port, () => {
	console.log('Started on port', port)
})

module.exports = {app}