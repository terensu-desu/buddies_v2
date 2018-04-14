var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var async = require("async");
var User = require("../models/user");
var Service = require("../models/service");
var middleware = require("../middleware");
var { isLoggedIn, checkUserOwnership } = middleware;

var csrfProtection = csrf();
router.use(csrfProtection);

// SHOW
router.get("/:user_id", function(req, res) {
	User.findById(req.params.user_id, function(err, foundUser) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			//transform timestamp from model into a friendly date
			var timestamp = foundUser._id.getTimestamp();
			var year = timestamp.getFullYear();
			var month = timestamp.getMonth() + 1;
			var date = timestamp.getDate();
			if(date < 10) {
				date = "0" + date;
			}
			if(month < 10) {
				month = "0" + month;
			}
			var createdAt = year + "/" + month + "/" + date;
			//find all services created by this user, get reviews and calculate overall rating
			Service.find({"author.id": foundUser._id })
			.populate("reviews")
			.exec(function(err, foundServices) {
				var populatedReviews = [];
				var grandTotalReviews = 0;
				var grandTotalRating = 0;
				for(var service of foundServices) {
					if(!isNaN(service.totalReviews)) {
						grandTotalReviews += service.totalReviews;
					}
					if(!isNaN(service.totalRating)) {
						grandTotalRating += service.totalRating;
					}
					for(var review of service.reviews) {
						populatedReviews.push(review);
					}
				}
				var overallRating = grandTotalRating / grandTotalReviews;
				res.render("users/show",
					{
						user: foundUser,
						createdAt: createdAt,
						rating: overallRating,
						reviews: populatedReviews,
						csrfToken: req.csrfToken()
					}
				);
			});
		}
	});
});

// EDIT
router.get("/:user_id/edit", checkUserOwnership, function(req, res) {
	User.findById(req.params.user_id, function(err, foundUser) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			res.render("users/edit", {user: foundUser, csrfToken: req.csrfToken()});
		}
	});
});

// UPDATE
router.put("/:user_id", checkUserOwnership, function(req, res) {
	var editedProfile = {
		about_profile: req.body.about_profile,
		languages: req.body.languages,
		location: req.body.location,
		image: req.body.image,
		school: req.body.school,
		work: req.body.work
	};
	User.findByIdAndUpdate(req.params.user_id, editedProfile, function(err, updatedProfile) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			req.flash("success", "Profile successfully updated!");
			res.redirect("/users/" + req.params.user_id);
		}
	});
});

// DESTROY USER ACCOUNT
// ---create checkUserOwnership middleware
// ---make a confirmation button middleware first. then apply to service and review deleting.
/*router.delete("/:id", checkUserOwnership, function(req, res) {
	User.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("/services/index");
		} else {
			req.flash("success", "Profile successfully removed.");
			res.redirect("/");
		}
	});
});*/

module.exports = router;
