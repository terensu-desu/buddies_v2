var mongoose = require("mongoose");

var serviceSchema = new mongoose.Schema({
	title: String,
	headline: String,
	image: String,
	location: String,
	total_time: String,
	memo: String,
	date: String,
	language: String,
	description: String,
	provided_items: String,
	guest_options: String,
	notes: String,
	location_notes: String,
	price: String,
	serviceType: String,
	category: String,
	subcategory: String,
	author: {
		id: {
			type: mongoose.Schema.Types.ObjectId,
			ref: "User"
		},
		user: String,
		image: String,
		about_profile: String
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
