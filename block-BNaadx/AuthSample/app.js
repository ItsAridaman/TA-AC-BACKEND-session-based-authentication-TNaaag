var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var dotenv = require('dotenv').config();
var session=require('express-session');
var MongoStore = require('connect-mongo');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var session = require('express-session');
var flash=require('connect-flash');
var fileUpload=require('express-fileupload');
var auth=require('./middlewares/auth');
// var passport=require('passport');



mongoose.connect("mongodb://127.0.0.1:27017/AuthDemo", (err) => {
  console.log(err ? err : "connected to the database")
});
require('./modules/passport');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use(session({
  secret: process.env.SECRET,
  resave: false,
  saveUninitialised: false,
  store: MongoStore.create({
   
    mongoUrl: "mongodb://127.0.0.1:27017/AuthDemo"
  })}));

// app.use(passport.initialize());
// app.use(passport.session());

app.use(flash());
app.use(fileUpload());

app.use(auth.userInfo);
app.use('/', indexRouter);
app.use('/users', usersRouter);




// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

app.listen('5000', () => {
  console.log("connected");
})

module.exports = app;
