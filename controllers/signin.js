const handleSignin = (req, resp, db, bcrypt) => {
	const { email, password } = req.body;
	if (!email || !password) {
		resp.status(400).json("Incorrect user details");
	}
	db.select("email", "hash").from("login")
	.where("email", "=", email)
		.then(data => {
			const isValid = bcrypt.compareSync(password, data[0].hash);
			if (isValid) {
				return db.select("*").from("users")
				.where("email", "=", email)
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