require('dotenv').config()
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const jwt = require("jsonwebtoken");

var mongoose = require('mongoose'); //added
var helmet = require('helmet');

var Dishes = require('./models/dishes'); //added

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/usersRouter');
var dishRouter = require('./routes/dishRouter');
//var x = require('./routes/dishRouter');

var app = express();

var url = 'mongodb://localhost:27017/conFusion' //added
//added to connect
var connect = mongoose.connect(url);

//added
connect.then((db) => {
  console.log('Koneksi sukses');
}, (err) => {
  console.log('error : ', err);
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
//app.use(helmet());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/dishes',authenticateToken,dishRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
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
function authenticateToken(req, res, next) {
  // Gather the jwt access token from the request header
  const token = req.headers.authorization;

  try{
    jwt.verify(token, process.env.TOKEN_SECRET);
    console.log('MASUK');
    next(); // pass the execution off to whatever request the client intended
    
  }catch(err){
    console.log('UNAUTHORIZED');
    res.status(403)
    res.send({'message' : 'UNAUTHORIZED'});
  }
}
module.exports = app;
