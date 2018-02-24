var mongoose = require("mongoose");

var reviewSchema = new mongoose.Schema({
	text: String,
	rating: Number,
	date: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user: String,
		image: String,
	}
});

module.exports = mongoose.model("Review", reviewSchema);
