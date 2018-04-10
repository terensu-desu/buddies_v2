var express = require('express');
var router = express.Router();
var csrf = require('csurf');
var Service = require("../models/service");
var middleware = require("../middleware");

var { isLoggedIn } = middleware;

var csrfProtection = csrf();
router.use(csrfProtection);

router.get("/:id", isLoggedIn, function(req, res) {
	Service.findById(req.params.id, function(err, foundService) {
		if(err) {
			req.flash("negative", "There was an error handling your request. Please try again.");
			res.redirect("back");
		} else {
			res.render("checkout/index", {service: foundService, csrfToken: req.csrfToken()});
		}
	});
});

module.exports = router;