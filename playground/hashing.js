const jwt = require('jsonwebtoken');

var data = {
	id: 10
};
var token = jwt.sign(data, '123abc');
console.log(token)

var decoded = jwt.verify(token, '123abc');
console.log('decoded', decoded)
// const {SHA256} = require('crypto-js');
// var message = 'I am user mber 3';
// var hash = SHA256(message).toString();

// console.log(`Message : ${message}`);
// console.log(`Hash: ${hash}`);

// var data = {
// 	id: 4
// }
// var token = {
// 	data,
// 	hash: SHA256(JSON.stringify(data) + 'Secretcode').toString()
// }

// token.data.id = 5;
// token.hash = SHA256(JSON.stringify(token.data)).toString();

// var resultHash = SHA256(JSON.stringify(token.data) + 'Secretcode').toString();



// if(resultHash === token.hash) {
// 	console.log('Data is secure')
// }else {
// 	console.log('Data is NOT secure')
// }