var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var session = require('express-session');
var morgan = require('morgan');
var mongoose = require('mongoose');

var passport = require('passport');
var MongoStore = require('connect-mongo')(session);
var config = require('./config/database');

//var db = mongoose.connect(config.database, { useMongoClient: true });

mongoose.Promise = global.Promise; //we add this because if we dont, you may get a warning that mongoose's default promise library is deprecated
mongoose.connect(config.database, { useMongoClient: true }, function(err) {
    if(err) {
        console.log('Connection error');
    }
})





//var index = require('./routes/index');
//var users = require('./routes/users');
var api = require('./routes/api');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.use(session({
//   secret:'mysec', resave: false, saveUninitialized: false,
//   store: new MongoStore({ mongooseConnection: mongoose.connection }),
//   cookie: { maxAge: 180 * 60 * 1000 }

// }));
app.use(passport.initialize());

app.get('/', function(req, res) {
  res.send('Page under construction.');
});

app.use('/api', api);


//app.use('/users', users);

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
