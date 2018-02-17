var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Service = require("../models/service");
var middleware = require("../middleware");
var { isLoggedIn } = middleware;

// INDEX SHOW ALL
router.get("/", function(req, res) {
	res.render("services/index");
});

// NEW FORM
router.get("/new", isLoggedIn, function(req, res) {
	res.render("services/new");
});

// CREATE
router.post("/", isLoggedIn, function(req, res) {
	var pendingNewService = {
		title: req.body.title,
		image: req.body.image,
		price: req.body.price,
		description: req.body.description,
		id: req.user._id,
		user: req.user.email
	}
	/*req.body.service.author = {
		id: req.user._id,
		user: req.user.email
	};*/
	Service.create(pendingNewService, function(err, newService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
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
			res.render("services/show", {service: foundService});
		}
	});
});

// EDIT
router.get("/:id/edit", function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			res.render("services/edit", {service: foundService});
		}
	});
});

// UPDATE
router.put("/:id", function(req, res) {
	Service.findByIdAndUpdate(req.params.id, req.body.service, function(err, updatedService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			req.flash("success", "Service listing successfully updated!");
			res.redirect("/services/" + req.params.id);
		}
	});
});

// DESTROY CAMPGROUND
router.delete("/:id", function(req, res) {
	Service.findByIdAndRemove(req.params.id, function(err) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			req.flash("success", "Service listing successfully removed.");
			res.redirect("/services");
		}
	});
});

module.exports = router;