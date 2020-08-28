const Clarifai = require("clarifai");

const app = new Clarifai.App({
  apiKey: "92f5c0602a32478584e32c294357ac38"
});

const handleApiCall = (req, resp) => {
	app.models
		.predict("c0c0ac362b03416da06ab3fa36fb58e3", req.body.input)
		.then(data => {
			resp.json(data);
		})
		.catch(err => resp.status(400).json("Unable to work with the API"))
}

const handleImage = (req, resp, db) => {
	const { id } = req.body; 
	db("users").where("id", "=", id)
	.increment("entries", 1)
	.returning("entries")
	.then(entries => {
		resp.json(entries[0]);
	})
	.catch(err => resp.status(400).json("Unable to get entries"));
}

module.exports = {
	handleImage,
	handleApiCall 
}