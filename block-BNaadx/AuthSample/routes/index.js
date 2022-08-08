var express = require('express');
var router = express.Router();
var user = require('../Models/UserModel');
var product = require('../Models/productmodel');
var comment = require('../Models/commentModel');

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
  product.find({},(err, result)=>
  {
    res.render('mainpage.ejs', {result});
  })
  // var error=req.flash('error')[0];
  // console.log(error);
  // return res.render('login.ejs',{error});
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
});

router.get('/addnew', (req,res)=>
{
  res.render('addproduct.ejs');
});

router.post('/addnew',(req,res)=>
{
  product.create(req.body,(err,result)=>
  {
    if(err) console.log(err);
    res.redirect('/login')
  })
});

router.get('/:id/productdetails', (req,res)=>
{
  var id=req.params.id;
  product.findById(id, (err,result)=>
  {
    comment.find({productId:id},(err,comment)=>
    {
      res.render('productdetails.ejs',{result,comment});
    })
    
  });
});

router.get('/:id/edit', (req,res)=>
{
  var id=req.params.id;
  product.findById(id, (err,result)=>
  {
    res.render('editproduct.ejs', {result});
  })
});

router.post('/:id/edit', (req,res)=>
{
  var id=req.params.id;
  product.findByIdAndUpdate(id,req.body, (err,result)=>
  {
res.redirect('/' + id + '/productdetails');
  })
});

router.get('/:id/delete', (req,res)=>
{
  var id=req.params.id;
  product.findByIdAndDelete(id, (err,result)=>
  {
    comment.deleteMany({productId:result._id}, (err,result)=>
    {
      res.redirect('/login');

    })
  })
});

router.post('/:id/comment', (req,res)=>
{
  var id=req.params.id;
  req.body.productId=id;
  comment.create(req.body,(err,result)=>
  {
    product.findByIdAndUpdate(id, { $push: { Comments: result._id } }, (err, result) => {
      if (err) console.log(err);
    res.redirect('/' + id + '/productdetails')
  })

})
});

router.get('/comment/edit/:id', (req,res)=>
{
  var id=req.params.id;
  comment.findById(id, (err, comment)=>
  {
    res.render('editcomment.ejs', {comment:comment});
  })
});

router.post('/comment/edit/:id', (req,res)=>
{
  var id=req.params.id;
  comment.findByIdAndUpdate(id,req.body, (err,comment)=>
  {
    
      res.redirect('/' + comment.productId + '/productdetails')
  })
});

router.get('/comment/delete/:id', (req,res)=>
{
  var id=req.params.id;
  comment.findByIdAndDelete(id,req.body ,(err, comment)=>
  {
    product.findByIdAndUpdate(comment.productId,{$pull:{Comments:comment._id}},(err,result)=>
  {
    res.redirect('/' + comment.productId + '/productdetails');

  });
  });
});

router.get('/:id/likes',(req,res)=>
{
  var id=req.params.id;
  product.findByIdAndUpdate(id, { $inc: { Likes: 1 } }, (err, success) => {
    if (err) console.log(err);
   res.redirect('/' + id + '/productdetails')
})
});

router.post('/:id/cart',(req,res)=>
{
  var id=req.params.id;
  product.findById(id,req.body,(err,result)=>
  {
    cart.update()
  })
  
})

module.exports = router;
