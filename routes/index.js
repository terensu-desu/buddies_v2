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
	Service.find({}, function(err, services) {
		if(err) {
			console.log(err);
		} else {
			res.render('index', {requestServices: services.slice(0,4), supportServices: services.slice(0,4), csrfToken: req.csrfToken()});
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