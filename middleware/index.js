var middlewareObj = {};
var Service = require("../models/service");
var Review = require("../models/review");

middlewareObj.isLoggedIn = function(req, res, next) {
	if(req.isAuthenticated()) {
		return next();
	}
	req.flash("negative", "Please login first.")
	res.redirect('/login');
}

module.exports = middlewareObj;