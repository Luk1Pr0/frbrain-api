const express = require("express");
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt-nodejs");
const app = express();
const cors = require("cors");
const knex = require("knex");
const register = require("./controllers/register");
const signin = require("./controllers/signin");
const profile = require("./controllers/profile");
const image = require("./controllers/image");

const db = knex({
  client: 'pg',
  connection: {
    host: process.env.DATABASE_URL,
    ssl: true
  }
});

db.select("*").from("users").then(data => {})

app.use(bodyParser.json())
app.use(cors())

app.get("/", (req, res) => {res.send("This is working") })
app.post("/signin", (req, resp) => {signin.handleSignin(req, resp, db, bcrypt)});
app.post("/register", (req, resp) => {register.handleRegister(req, resp, db, bcrypt)});
app.get("/profile/:id", (req, resp) => {profile.handleProfileGet(req, resp, db)});
app.put("/image", (req, resp) => {image.handleImage(req, resp, db)})
app.post("/imageurl", (req, resp) => {image.handleApiCall(req, resp)})

app.listen(process.env.PORT || 2000 , () => {
	console.log(`App is running on port ${process.env.PORT}`);
});