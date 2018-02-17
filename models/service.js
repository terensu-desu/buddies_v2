var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema({
	title: String,
	image: String,
	description: String,
	price: String,
	serviceType: String,
	category: String,
	subcategory: String
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user: String
	},
	reviews: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Review"
		}
	]
});

// other things to add: rating, languages, date, time, etc

module.exports = mongoose.model("Service", serviceSchema);
