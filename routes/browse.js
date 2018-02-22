var express = require('express');
var router = express.Router();
var Service = require("../models/service");

// GET recommended, needs to be placed ABOVE "browse/:type" GET
router.get("/recommended", function(req, res) {
	res.render("browse/recommended");
});

// GET browse page info by service type
router.get("/:type", function(req, res) {
	Service.find({"serviceType": req.params.type}, function(err, foundServices) {
		if(err || foundServices === undefined) {
			req.flash("negative", "Sorry, an error occurred. Please try again.")
			res.redirect("back");
		} else {
			var categories = {};
			categories.buddies = ["交通","市役所","学校","病院","銀行・金融","子ども","趣味","生活相談","料理","食事","美容・ファッション","その他"];
			categories.life = ["生活","文化","学業","お金","子育て","健康","職場","睡眠","その他"];
			categories.events = ["ホームパーティ","居酒屋・バー","その他"];
			var servicesObject = {
				buddies: [],
				life: [],
				events: []
			};
			for(let service of foundServices) {
				if(service["category"] === "buddies") {
					servicesObject.buddies.push(service);
				} else if(service["category"] === "life") {
					servicesObject.life.push(service);
				}	else if(service["category"] === "events") {
					servicesObject.events.push(service);
				}
			}
			res.render("browse/index", {services: servicesObject, categories: categories});
		}
	});
});

module.exports = router;