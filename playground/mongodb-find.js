const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp',{ useNewUrlParser: true }, (err, client) => {
	if(err){
		return console.log('Unable to connect to MongoDB server');
	}
	console.log('Connected to MongoDB server');
	const db = client.db('TodoApp');

	// db.collection('Todos').find().toArray().then((docs) =>{
	// 	console.log(JSON.stringify(docs, undefined, 2));
	// }, (err) => {
	// 	console.log('Unable to fetch', err)
	// });

	// db.collection('Todos').find().count().then((count) =>{
	// 	console.log(count);
	// }, (err) => {
	// 	console.log('Unable to fetch', err)
	// });

	db.collection('Users').find({name: 'Vahe'}).count().then((count) => {
		console.log(`Count is ${count}`)
	}, (err) => {
		console.log('Error while fetching data', err)
	})
	client.close();
});