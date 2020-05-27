const express = require('express');
const app = express();
const port = 4000; 
const {MongoClient} = require('mongodb');
const cors = require('cors')
const bodyParser = require('body-parser');

app.use(cors());
app.use(bodyParser.urlencoded({
  extended: false,
}));
app.use(bodyParser.json());

const url = 'mongodb://localhost:27017';
const dbName = '95ExchangeDB';
const client = new MongoClient(url);

client.connect(err => {
	if (err) {
		console.log(err);
		process.exit(1);
	}

	console.log('Connected successfully to auth server');
	const db = client.db(dbName);

	app.get('/api/login', (req, res) => {
		if (!req.query.password) {
			res.status(400).send({
				valid: false
			});
		}

		else if(req.query.password.length > 0) {
			db.collection('users')
			.findOne({
				user: req.query.user
			})
			.then(doc => {
				console.log(doc);
				res.send({
					valid: doc !== null && doc.password === req.query.password,
					email: doc.email,
					role: doc.role
				});
			})
			.catch(e => {
				console.log(e);
				res.status(400).send({
					valid: false
				});
			});
		}
	});

	app.post('/api/register', (req, res) => {
		console.log(req.body);
		var validEntry = (req.body.password !== '') && (req.body.email.includes('@')) && (req.body.user !== '') && (req.body.role !== '')
		if (validEntry)
			console.log("ALL VALUES ENTERED");

		db.collection('users').find({$or: [ {user: req.body.user}, {email: req.body.email}]}).toArray((err, doc) => {     
			if(doc.length > 0) {
				validEntry = false;
				console.log("User with same user and/or email already exists in DB.");

				res.send({
					valid: validEntry,
					status: "dup_entry"
				})
			}

			else if(validEntry) {
				db.collection('users').insertOne({
					user: req.body.user, 
					email: req.body.email, 
					password: req.body.password,
					role: req.body.role
				});
				res.send({
					valid: validEntry,
					role: req.body.role,
					user: req.body.user,
					email: req.body.email,
					status: "OK"
				})
			}
		})
	});

app.listen(port, () => console.log(`Auth service listening on port ${port}!`));

});
