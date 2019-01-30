require('dotenv').config();
var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var notesRouter = require('./routes/notes');

var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var bcrypt = require('bcrypt');
var models = require('./models');

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
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: 'true' }
}));

app.use(flash());

app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next){
  
  res.locals.flash_info = req.flash("infos");
  res.locals.flash_success = req.flash("success");
  res.locals.flash_error = req.flash("error");
  res.locals.user = (req.user) ? req.user : null;
  next();

});

app.use('/', indexRouter);
app.use('/auth', usersRouter);
app.use('/notes', notesRouter);


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

//passport config

passport.use(new LocalStrategy({
  usernameField : 'email',
  passwordField: 'password'
},
function(email, password, done){
  console.log('Cehcking login....');

  models.User.findOne({
    where: {email:email}
  })
  .then(
    function(result){
      if(!result){
        return done(null, false, {
          message: 'There is no account association with this email.'
        })
      }

      let yes = bcrypt.compareSync(password, result.password);

      if(yes){
        return done(null, result);
      }else{
        return done(null, false, {
          message: 'Your password is incorrect.'
        })
      }
    }
  )
  .catch(function(err){
    if(err){ return done(err); }
  })

}
));

passport.serializeUser(function(user, done){
  done(null , user.id);
});

passport.deserializeUser(function(id, done){
  console.log('user info success');

  models.User.findOne({where:{id:id}}).then(function(result){
    if(!result){
      return done(null, false);
    }
    return done(null, result);
  })
  .catch(function(err){
    if(err){
      return done(err);
    }
  })

})

module.exports = app;