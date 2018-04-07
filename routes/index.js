var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var Service = require("../models/service");
var User = require('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
	Service.find({}, function(err, foundServices) {
		if(err) {
			console.log(err);
		} else {
			var chunkSize = 2;
			var request = [];
			var requestChunked = [];
			var support = [];
			var supportChunked = [];
			for(var service of foundServices) {
				if(service["serviceType"] === "request") {
					request.push(service);
				} else if(service["serviceType"] === "support") {
					support.push(service);
				}
			}
			for(var i = 0; i < request.length; i += chunkSize) {
				requestChunked.push(request.slice(i, i + chunkSize));
			}
			for (var j = 0; j < support.length; j+= chunkSize) {
				supportChunked.push(support.slice(j, j + chunkSize));
			}
			res.render('index', 
				{
					requestServices: requestChunked.slice(0,2),
					supportServices: supportChunked.slice(0,2),
					csrfToken: req.csrfToken()
				}
			);
		}
	})
});

// GET login page
router.get("/login", function(req, res) {
	res.render("login",  {csrfToken: req.csrfToken()});
});

router.post("/login", passport.authenticate("local.login",
	{
		successRedirect: "/",
		failureRedirect: "/login"
	})
);

// GET register page
router.get("/register", function(req, res) {
	res.render("register", {csrfToken: req.csrfToken()});
});

// CREATE User
router.post("/register", passport.authenticate("local.register", {
	successRedirect: "/",
	failureRedirect: "/register",
	failureFlash: true
}));

// Logout
router.get("/logout", function(req, res) {
	req.logout();
	req.flash("success", "Logged you out!");
	res.redirect("/");
});

module.exports = router;