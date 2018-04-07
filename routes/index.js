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
			var requestHelper = 0;
			var support = [];
			var supportHelper = 0;
			for(var service of foundServices) {
				if(service["serviceType"] === "request") {
					if(!request[requestHelper] || request[requestHelper].length < chunkSize) {
						request[requestHelper].push(service);
						//console.log("[REQUEST ARRAY 0]", request[0]);
					} else {
						requestHelper++
						request[requestHelper].push(service);
						//console.log("[REQUEST ARRAY 1]", request[1]);
					}
				} else if(service["serviceType"] === "support") {
					if(!support[supportHelper] || support[supportHelper].length < chunkSize) {
						support[supportHelper].push(service);
						//console.log("[SUPPORT ARRAY 0]", support[0]);
					} else {
						supportHelper++;
						support[supportHelper].push(service);
						//console.log("[SUPPORT ARRAY 1]", support[1]);
					}
				}
			}
			res.render('index', {requestServices: request.slice(0, 2), supportServices: support.slice(0, 2), csrfToken: req.csrfToken()});
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