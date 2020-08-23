const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");

const db = knex({
  client: 'pg',
  connection: {
    host : '127.0.0.1',
    user : 'postgres',
    password : 'password',
    database : 'frbrain'
  }
});

db.select("*").from("users").then(data => {
	console.log(data);
});

app.use(bodyParser.json());
app.use(cors());

const database = {
	users: [
		{
			id: "123",
			name: "John",
			email: "john@gmail.com",
			password: "cookies",
			entries: 0,
			joined: new Date()
		},
		{
			id: "124",
			name: "Sally",
			email: "sally@gmail.com",
			password: "pear",
			entries: 0,
			joined: new Date()
		}
	],
	login: [
		{
			id: "987",
			hash: "",
			email: "john@gmail.com"
		}
	]
}

app.get("/", (req, res) => {
	res.send(database.users);
})

app.post("/signin", (req, resp) => {
	bcrypt.compare("banana", "$2a$10$EgMizZEgnN/vvDphkBQt/Oek2nP5EmzyGnGkYm6F/oDDfpEjRPI9G", function(err, res){
		console.log("first guess", res);
	});
	bcrypt.compare("vegies", "$2a$10$EgMizZEgnN/vvDphkBQt/Oek2nP5EmzyGnGkYm6F/oDDfpEjRPI9G", function(err, res){
		console.log("second guess", res);
	})
	if (req.body.email === database.users[0].email &&
		req.body.password === database.users[0].password) {
	resp.json(database.users[0]);
	} else {
		resp.status(400).json("Error logging in");
	}
})

app.post("/register", (req, res) => {
	const {email, name, password } = req.body;
	db("users")
	.returning("*")
	.insert({
		email: email,
		name: name,
		joined: new Date()
	})
	.then(user => {
		res.json(user[0]);
	})
	.catch(err => res.status(400).json("Unable to register"));
})

app.get("/profile/:id", (req, resp) => {
	const { id } = req.params;
	db.select("*").from("users").where({id})
	.then(user => {
		if (user.length) {
			resp.json(user[0])
		} else {
			resp.status(400).json("Error getting user");
		}
	})	
	// if (!found) {
	// 	resp.status(400).json("User not found");
	// }
})

app.put("/image", (req, resp) => {
	const { id } = req.body; 
	let found = false;
	database.users.forEach(user => {
		if (user.id === id) {
			found = true;
			user.entries++
			return resp.json(user.entries);
		}
	})
	if (!found) {
		resp.status(400).json("User not found");
	}
})

app.listen(2000, () => {
	console.log("App is running on port 2000");
});