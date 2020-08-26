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
	
});

app.use(bodyParser.json());
app.use(cors());

app.get("/", (req, res) => {
	res.send(database.users);
})

app.post("/signin", (req, resp) => {
	db.select("email", "hash").from("login")
	.where("email", "=", req.body.email)
		.then(data => {
			const isValid = bcrypt.compareSync(req.body.password, data[0].hash);
			if (isValid) {
				return db.select("*").from("users")
				.where("email", "=", req.body.email)
				.then(user => {
					resp.json(user[0])
				})
				.catch(err => resp.status(400).json("Unable to get user"))
			} else {
				resp.status(400).json("Wrong Credentials")	
			}
	})
	.catch(err => resp.status(400).json("Wrong Credentials"))
})

app.post("/register", (req, res) => {
	const {email, name, password } = req.body;
	const hash = bcrypt.hashSync(password);
	db.transaction(trx => {
		trx.insert({
			hash: hash,
			email: email
		})
		.into("login")
		.returning("email")
		.then(loginEmail => {
			return trx("users")
			.returning("*")
			.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
			})
			.then(user => {
				res.json(user[0]);
			})
		})
		.then(trx.commit)
		.catch(trx.rollback)
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
	db("users").where("id", "=", id)
	.increment("entries", 1)
	.returning("entries")
	.then(entries => {
		resp.json(entries[0]);
	})
	.catch(err => resp.status(400).json("Unable to get entries"));
})

app.listen(2000, () => {
	console.log("App is running on port 2000");
});