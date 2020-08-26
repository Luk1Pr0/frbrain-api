const handleSignin = (req, resp, db, bcrypt) => {
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
}

module.exports = {
	handleSignin: handleSignin
}