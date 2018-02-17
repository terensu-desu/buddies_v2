var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var passport = require('passport');
var User = require('../models/user');

var csrfProtection = csrf();
router.use(csrfProtection);

/* GET home page. */
router.get('/', function(req, res, next) {
	var requestServices = [
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
	];
	var supportServices = [
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
		{
			title: "Lorem Ipsum",
			image: "https://images.unsplash.com/photo-1517713982677-4b66332f98de?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=5add0b58e13b226e807f96ca21ec30b4&auto=format&fit=crop&w=1350&q=80",
			url: "#",
			meta: "Ipsum Lorem - Loremville",
			price: 54,
			rating: ""
		},
	];
  res.render('index', { requestServices: requestServices, supportServices: supportServices, csrfToken: req.csrfToken() });
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
	successRedirect: "index",
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