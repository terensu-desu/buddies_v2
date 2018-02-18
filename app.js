var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var passport = require('passport');
var methodOverride = require('method-override');
var LocalStrategy = require('passport-local');
var flash = require('connect-flash');
var validator = require('express-validator');

var Service = require('./models/service');
var Review = require('./models/review');
var User = require('./models/user');

var index = require('./routes/index');
var users = require('./routes/users');
var services = require('./routes/services');

var app = express();
var url = "mongodb://localhost/buddies" || process.env.DATABASEURL;
mongoose.connect(url);
require("./config/passport");
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(validator());
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(methodOverride("_method"));

app.use(require('express-session')({
  cookie:{
    secure: true,
    maxAge:60000
  },
	secret: "Farz is the best",
	resave: false, // required
	saveUninitialized: false // required
}));
app.use(flash());

// PASSPORT CONFIG
app.use(passport.initialize());
app.use(passport.session());
/*passport.use(new LocalStrategy(User.authenticate())); // Comes from passport-local-mongoose, same with next two
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());*/
app.use(function(req, res, next) {
	res.locals.currentUser = req.user;
	res.locals.message = req.flash();
	next();
});

// ROUTES
app.use("/services", services)
app.use('/users', users);
app.use(index);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;