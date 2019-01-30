var express = require('express');
var router = express.Router();
var email = require("emailjs/email");
var mailServer 	= email.server.connect({
  user:    process.env.MAIL_USER,
  password: process.env.MAIL_PASS,
  host: process.env.MAIL_HOST,
  port : process.env.MAIL_PORT,
  tls:     true
});


router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/support', function(req, res, next) {
  res.render('users/support');
});


// POST send contact message to site admin
router.post('/support', function(req, res, next){
  
  let formData = req.body;

  // send the message and get a callback with an error or details of the message that was sent
  mailServer.send({
    text:    formData.message,
    from:    formData.name+" <"+formData.email+">",
    to:      "rawaikyaw@gmail.com",
    cc:      "wansurawai@gmail.com",
    subject: formData.subject
  }, function(err, message) { 
    console.log(err || message); 
    req.flash('success',"Successfully send the message!");

    return res.redirect('/support');
  });
  
  
  
})

module.exports = router;
