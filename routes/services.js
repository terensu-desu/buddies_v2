var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Service = require("../models/service");
var User = require("../models/user");
var middleware = require("../middleware");
var { isLoggedIn, checkListingOwnership } = middleware;

var csrfProtection = csrf();
router.use(csrfProtection);

// INDEX SHOW ALL
router.get("/", function(req, res) {
	res.render("services/index");
});

// NEW FORM
router.get("/new", isLoggedIn, function(req, res) {
	res.render("services/new", {csrfToken: req.csrfToken()});
});

// CREATE
router.post("/", isLoggedIn, function(req, res) {
	var pendingNewService = {
		title: req.body.title,
		headline: req.body.headline,
		location: req.body.location,
		memo: req.body.memo,
		image: req.body.image,
		date: req.body.date,
		price: req.body.price,
		total_time: req.body.total_time,
		language: req.body.language,
		description: req.body.description,
		provided_items: req.body.provided_items,
		guest_options: req.body.guest_options,
		notes: req.body.notes,
		location_notes: req.body.location_notes,
		serviceType: req.body.serviceType,
		category: req.body.category,
		author: {
			id: req.user._id,
			user: req.user.name,
			image: req.user.image,
			about_profile: req.user.about_profile
		}
	};
	Service.create(pendingNewService, function(err, newService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			User.findById(req.user._id, function(err, foundUser) {
				if(err) {
					console.log(err);
				} else {
					newService.save();
					foundUser.services.push(newService._id);
					foundUser.save();
				}
			});
			req.flash("success", "New service listing created!");
			res.redirect("/");
		}
	});
});

// SHOW
router.get("/:id", function(req, res) {
	Service.findById(req.params.id).populate("reviews").exec(function(err, foundService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			var totalRating = 0;
			var avgRating = 0;
			if(foundService.reviews) {
				for(var review of foundService.reviews) {
					totalRating += review.rating;
				}
			}
			avgRating = totalRating * foundService.reviews.length || 0;
			res.render("services/show", {service: foundService, rating: avgRating, csrfToken: req.csrfToken()});
		}
	});
});

// EDIT
router.get("/:id/edit", checkListingOwnership, function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			res.render("services/edit", {service: foundService, csrfToken: req.csrfToken()});
		}
	});
});

// UPDATE
router.put("/:id", checkListingOwnership, function(req, res) {
	var editedService = {
		title: req.body.title,
		headline: req.body.headline,
		location: req.body.location,
		memo: req.body.memo,
		image: req.body.image,
		price: req.body.price,
		total_time: req.body.total_time,
		language: req.body.language,
		description: req.body.description,
		provided_items: req.body.provided_items,
		guest_options: req.body.guest_options,
		notes: req.body.notes,
		location_notes: req.body.location_notes
	};
	Service.findByIdAndUpdate(req.params.id, editedService, function(err, updatedService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			req.flash("success", "Service listing successfully updated!");
			res.redirect("/services/" + req.params.id);
		}
	});
});

// DESTROY SERVICE
router.delete("/:id", checkListingOwnership, function(req, res) {
	Service.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("/services/index");
		} else {
			req.flash("success", "Service listing successfully removed.");
			res.redirect("/");
		}
	});
});

module.exports = router;