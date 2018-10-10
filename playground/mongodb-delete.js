const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// db.collection('Todos').deleteMany({text: 'Masturbate'}).then((result)=>{
	// 	console.log(result)
	// });
	// db.collection('Todos').deleteOne({text: 'Masturbate'}).then((result)=>{
	// 	console.log(result);
	// });
	// db.collection('Todos').findOneAndDelete({text: 'Masturbate'}).then((results) => {
	// 	console.log(results);
	// });

	// db.collection('Users').deleteMany({name: 'Vahe'}).then((result) => {
	// 	console.log(result);
	// });

	db.collection('Users').deleteOne({_id: new ObjectID('5bb9c88acda5f94eaedf774f')}).then((result) => {
		console.log(result);
	})

	client.close();
});