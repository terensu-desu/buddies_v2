var mongoose = require("mongoose");
var bcrypt = require("bcrypt-nodejs");
var passportLocalMongoose = require("passport-local-mongoose");

var userSchema = new mongoose.Schema({
	name: String,
	email: {type: String, required: true},
	password: {type: String, required: true},
	image: String,
	about_profile: String,
	languages: String,
	location: String,
	school: String,
	work: String,
	verified: Boolean,
	//joined: Date,
	// USER RATING: have to get average rating from all service reviews
});

userSchema.methods.encryptPassword = function(password) {
	return bcrypt.hashSync(password, bcrypt.genSaltSync(5), null);
}; // creates encrypted password

userSchema.methods.validPassword = function(password) {
	return bcrypt.compareSync(password, this.password);
};

//userSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", userSchema);
