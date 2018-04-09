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
	User.findById(req.params.user_id).populate("reviews").exec(function(err, foundUser) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
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
			var allReviews = [];
			var avgRating = 0;

			/*async.each(foundUser.services, function(service) {
				Service.findById(service).populate("reviews").exec(function(err, foundService) {
					if(err) {
						console.log(err);
					} else {
						console.log("Hellooo")
						for(var review of foundService.reviews) {
							allReviews.push(review.rating);
						}
					}
				});
			});*/

			/*for(var service of foundUser.services) {
				Service.findById(service).populate("reviews").exec(function(err, foundService) {
					if(err) {
						console.log(err);
					} else {
						for(var review of foundService.reviews) {
							allReviews.push(review.rating);
						}
					}
				});
			}*/
			if(allReviews) {
				avgRating = allReviews.reduce((total, rating) => {
					total += rating
				}, 0) * allReviews.length;
			}
			// problem is render happens before rating gets handled
			res.render("users/show",
				{
					user: foundUser,
					createdAt: createdAt,
					rating: avgRating,
					csrfToken: req.csrfToken()
				}
			);
		}
	});
});

// EDIT
// ---create checkUserOwnership middleware
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
// ---create checkUserOwnership middleware
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
