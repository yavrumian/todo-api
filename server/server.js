const express = require('express');
const bodyParser = require('body-parser')

const {mongoose} = require('./db/mongoose.js')
const {Todo} = require('./models/todo');
const {User} = require('./models/user');

var port = 8080;
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

app.listen(port, () => {
	console.log('Started on port', port)
})

module.exports = {app}