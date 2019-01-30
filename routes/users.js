var express = require('express');
var router = express.Router();
var models = require('../models');
var Sequelize = require('sequelize');
var bcrypt = require('bcrypt');
var passport = require('passport');
var auth = require('connect-ensure-login').ensureLoggedIn;

/* GET users listing. */
router.get('/', function(req, res, next) {
  res.send('respond with a resource');
});

/* GET users login. */
router.get('/login', function(req, res, next) {
  res.render('users/login');
});

/* GET users register. */
router.get('/register', function(req, res, next) {
  res.render('users/register');
});

/* Post users register. */
router.post('/register', function(req, res, next) {
  
  let formData = req.body;
  //hsah password
  var saltRounds = 10;
  var salt = bcrypt.genSaltSync(saltRounds);
  var hash = bcrypt.hashSync(formData.password, salt);
    formData.password = hash;
  models.User.create(formData).then(function(result){
      // console.log(result);
      return res.redirect('/auth/login');
  })
  .catch((err)=>{
    console.log(err);
  });

});

//post user login 

router.post('/login', passport.authenticate('local',{

  successRedirect: '/notes',
  failureRedirect: '/auth/login',
  failureFlash : true
}),
function(req, res, next){
  res.redirect('/notes');
});

router.get('/logout', auth('/auth/login'), function(req, res){
  req.logout();
  return res.redirect('/auth/login');
})

router.get('/profile', auth('/auth/login'), function(req, res){
  return res.render('users/profile');
})



// login , register , my account , contact form ( For Home Work )

module.exports = router;
