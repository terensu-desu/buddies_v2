var express = require('express');
var router = express.Router({mergeParams: true});
var csrf = require('csurf');
var Service = require("../models/service");
var Review = require("../models/review");
var middleware = require("../middleware");

var { isLoggedIn, checkReviewOwnership } = middleware;

var csrfProtection = csrf();
router.use(csrfProtection);

// GET go to new review page
router.get("/new", isLoggedIn, function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "Sorry, that listing was not found.");
			res.redirect("back");
		} else {
			res.render("reviews/new", {service: foundService, csrfToken: req.csrfToken()});
		}
	});
});

// CREATE make a review
router.post("/", isLoggedIn, function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "Sorry, that listing was not found.");
			res.redirect("back");
		} else {
			var review = {
				text: req.body.text,
				rating: req.body.rating,
				author: {
					id: req.user._id,
					user: req.user.name,
					image: req.user.image
				},
				date: new Date()
			}
			review.date = review.date.toLocaleString("ja-JP", {year: "numeric", month: "long", day: "numeric"});
			Review.create(review, function(err, newReview) {
				if(err) {
					req.flash("negative", "Sorry, there was an error processing your request.");
					res.redirect("back");
				} else {
					newReview.save();
					foundService.reviews.push(newReview._id);
					if(isNaN(foundService.totalReviews)) {
						foundService.totalReviews = 1;
					} else {
						foundService.totalReviews += 1;
					}
					if(isNaN(foundService.totalRating)) {
						foundService.totalRating = 0;
					}
					foundService.totalRating = foundService.totalRating + newReview.rating;
					foundService.save();
					req.flash("success", "Review added! Thank you!");
					res.redirect("/services/" + req.params.id);
				}
			});
		}
	});
});

// GET go to edit page
router.get("/:review_id/edit", checkReviewOwnership, function(req, res) {
	Review.findById(req.params.review_id, function(err, foundReview) {
		if(err) {
			req.flash("negative", "Sorry, there was an error processing your request.");
			res.redirect("back");
		} else {
			res.render("reviews/edit", {service_id: req.params.id, review: foundReview, csrfToken: req.csrfToken()});
		}
	});
});

// PUT update review
router.put("/:review_id", checkReviewOwnership, function(req, res) {
	var pendingUpdatedReview = {
		text: req.body.text,
		rating: req.body.rating
	}
	Review.findByIdAndUpdate(req.params.review_id, pendingUpdatedReview, function(err, updatedReview) {
		if(err) {
			req.flash("negative", "Sorry, there was an error processing your request.");
			res.redirect("back");
		} else {
			req.flash("success", "Review updated");
			res.redirect("/services/" + req.params.id);
		}
	});
});

// DESTROY remove review
router.delete("/:review_id", checkReviewOwnership, function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "Sorry, that listing was not found.");
			res.redirect("back");
		} else {
			Review.findById(req.params.review_id, function(err, foundReview) {
				foundService.totalReviews -= 1;
				foundService.totalRating -= foundReview.rating;
				foundService.save();
				Review.remove({_id: foundReview._id}, function(err) {
					if(err) {
						req.flash("negative", "Sorry, there was an error processing your request.");
						res.redirect("back");
					} else {
						res.redirect("/");
					}
				})
			});
		}
	});
	/*Review.findByIdAndRemove(req.params.review_id, function(err) {
		if(err) {
			req.flash("negative", "Sorry, there was an error processing your request.");
			res.redirect("back");
		} else {
			res.redirect("/");
		}
	});*/
});

module.exports = router;