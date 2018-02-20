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

middlewareObj.checkListingOwnerShip = function(req, res, next) {
	if(req.isAuthenticated()) {
		Service.findById(req.params.id, function(err, foundService) {
			if(err) {
				req.flash("negative", "Sorry, that service listing doesn't exist!");
				res.redirect("/");
			} else {
				if(foundService.author.id.equals(req.user._id)) {
					next();
				} else {
					req.flash("negative", "Authorization error.");
					res.redirect("/");
				}
			}
		});
	} else {
		req.flash("negative", "Please login first.");
		res.redirect("/login");
	}
}

module.exports = middlewareObj;