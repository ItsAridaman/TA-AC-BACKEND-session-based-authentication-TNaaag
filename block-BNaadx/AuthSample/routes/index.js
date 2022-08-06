var express = require('express');
var router = express.Router();
var user = require('../Models/UserModel');
var bcrypt=require('bcrypt');


/* GET home page. */

router.get('/home', (req,res)=>
{
    res.render('index.ejs');
})

router.get('/RegistrationForm', (req,res)=>
{
    res.render('RegistrationForm.ejs');
})

router.post('/RegistrationForm', (req,res)=>
{
   user.create(req.body,(err,result)=>
   {
    console.log("user created successfully");
    res.redirect('/login');
   })
});

router.get('/login', (req,res)=>
{
  var error=req.flash('error')[0];
  console.log(error);
  return res.render('login.ejs',{error});
})

router.post('/login', (req,res)=>
{
  var{Username, Password}=req.body;
 if(!Username || !Password)
 {
  req.flash('error', 'Email/Password required');
  return res.redirect('/login');
 }
 user.findOne({Username},(err, user)=>
 {
  console.log("working 1");
  if(err) return next(err);
  if(!user)
  {
    console.log("working 2");

    req.flash('error', 'No user found with this username');

    return res.redirect('/login');
  }
  if(user)
  {
    console.log("working 3");

    if((user.Password)==Password)
    {
      console.log("working 4");


      req.session.userId=user.id;
      console.log(req.session);

     return res.render('mainpage.ejs');
    }
    else{
      console.log("working 5");
      req.flash('error', 'Wrong password');

       return res.redirect('/login');
    }
  }
  
 });

});

router.get('/logout',(req,res)=>
{
  req.session.destroy();
  res.clearCookie('connect-sid');
  res.redirect('/login');
})


module.exports = router;
