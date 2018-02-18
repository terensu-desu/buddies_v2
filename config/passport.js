var passport = require("passport");
var User = require("../models/user");
var LocalStrategy = require("passport-local").Strategy;

passport.serializeUser(function(user, done) {
	done(null, user.id);
});

passport.deserializeUser(function(id, done) {
	User.findById(id, function(err, foundUser) {
		done(err, foundUser);
	});
});

passport.use("local.register", new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true,
}, function(req, email, password, done) {
	req.checkBody("email", "Invalid email address").notEmpty().isEmail();
	req.checkBody("password", "Invalid password").notEmpty().isLength({min: 6});
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash("negative", messages));
	}
	User.findOne({"email": email}, function(err, foundUser) {
		if(err) {
			req.flash("negative", "There was an error processing your request.");
			return done(err);
		}
		if(foundUser) {
			req.flash("negative", "Email is already registered. Did you forget your password?");
			return done(null, false);
		}
		var newUser = new User();
		newUser.email = email;
		newUser.password = newUser.encryptPassword(password);
		newUser.name = req.body.name;
		newUser.image = req.body.image;
		newUser.about_profile = req.body.about_profile;
		newUser.save(function(err, result) {
			if(err) {
				return done(err);
			}
			return done(null, newUser);
		});
	});
}));

passport.use("local.login", new LocalStrategy({
	usernameField: "email",
	passwordField: "password",
	passReqToCallback: true
}, function (req, email, password, done) {
	req.checkBody("email", "Invalid email address").notEmpty().isEmail();
	req.checkBody("password", "Invalid password").notEmpty().isLength({min: 6});
	var errors = req.validationErrors();
	if(errors) {
		var messages = [];
		errors.forEach(function(error) {
			messages.push(error.msg);
		});
		return done(null, false, req.flash("negative", messages));
	}
	User.findOne({"email": email}, function(err, foundUser) {
		if(err) {
			req.flash("negative", "There was an error processing your request.");
			return done(err);
		}
		if(!foundUser) {
			req.flash("negative", "Incorrect email or password.");
			return done(null, false);
		}
		if(!foundUser.validPassword(password)) {
			req.flash("negative", "Incorrect email or password.");
			return done(null, false);
		}
		return done(null, foundUser);
	});
}));

//passport.use(new LocalStrategy(User.authenticate()));