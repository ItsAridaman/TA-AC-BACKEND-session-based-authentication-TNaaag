var express = require('express');
var router = express.Router();
var user = require('../Models/UserModel');
var product = require('../Models/productmodel');
var comment = require('../Models/commentModel');
var mkdirp = require('mkdirp');
var fs = require('fs-extra');
var resizeImage = require('resize-img');


var bcrypt = require('bcrypt');


/* GET home page. */

router.get('/home', (req, res) => {
  res.render('index.ejs');
});

router.get('/RegistrationForm', (req, res) => {
  res.render('RegistrationForm.ejs');
});

router.post('/RegistrationForm', (req, res) => {
  user.create(req.body, (err, result) => {
    console.log("user created successfully");
    res.redirect('/login');
  })
});

router.get('/login', (req, res) => {
  var error = req.flash('error')[0];
  console.log(error);
  return res.render('login.ejs', { error });

})

// router.get('/login', (req,res)=>
// {
//   product.find({},(err, result)=>
//   {

//     res.render('mainpage.ejs', {result});
//   })
//   // var error=req.flash('error')[0];
//   // console.log(error);
//   // return res.render('login.ejs',{error});
// })

router.post('/login', (req, res) => {
  var { Username, Password } = req.body;
  if (!Username || !Password) {
    req.flash('error', 'Email/Password required');
    return res.redirect('/login');
  }
  user.findOne({ Username }, (err, user) => {
    console.log("working 1");
    if (err) return next(err);
    if (!user) {
      console.log("working 2");

      req.flash('error', 'No user found with this username');

      return res.redirect('/login');
    }
    if (user) {
      console.log("working 3");

      if ((user.Password) == Password) {
        product.find({}, (err, result) => {

          if (err) console.log(err);
          if (!req.session.userId) {
            console.log("no session created");
            req.session.userId = user._id;
            req.session.cart = [];
            return res.redirect('/mainpage');
          }
          if (req.session.userId) {
            console.log("session already created");
            console.log(req.session.cart);

            return res.redirect('/mainpage');
          }

        })
      }
      else {
        console.log("working 5");
        req.flash('error', 'Wrong password');
        return res.redirect('/login');
      }
    }
  });
});

// router.post('/login', (req, res) => {
//   var { Username, Password } = req.body;
//   if (!Username || !Password) {
//     req.flash('error', 'Email/Password required');
//     return res.redirect('/login');
//   }
//   user.findOne({ Username }, (err, user) => {
//     console.log("working 1");
//     if (err) return next(err);
//     if (!user) {
//       console.log("working 2");

//       req.flash('error', 'No user found with this username');

//       return res.redirect('/login');
//     }
//     if (user) {
//       console.log("working 3");

//       if ((user.Password) == Password) {
//         product.find({}, (err, result) => {
//           console.log("working 4");
//           req.session.userId = user.id;
//           if (req.session.cart) {
//             console.log("cart available");
//           }
//           if (!req.session.cart) {
//             req.session.cart = [];
//           }
//           console.log(req.session.cart);
//           console.log("forwarded");
//           // return res.render('mainpage.ejs', { result: result });
//           return res.redirect('/mainpage');

//         })
//       }
//       else {
//         console.log("working 5");
//         req.flash('error', 'Wrong password');
//         return res.redirect('/login');
//       }
//     }
//   });
// });
router.get('/mainpage/filter', (req, res) => {
  var cart = req.session.cart;
  var category = req.query.category;
  var price = req.query.price;
  var size = req.query.size;

  var myArray = price.split("");
  if (myArray[0] == 'L') {
    var myvalue = 1;
  };
  if (myArray[0] == 'H') {
    var myvalue = -1;
  };

  product.find({
    $and: [
      { Name: new RegExp(category, 'i') },
      { Size: new RegExp(size, 'i') }
    ]
  }).sort({Price: myvalue}).exec(req.body, (err, result) => {
    console.log(result);
    res.render('mainpage.ejs', { result: result, cart: cart });
  });
})





router.get('/mainpage', (req, res) => {
  var cart = req.session.cart;


  product.find({}, req.body, (err, result) => {

    res.render('mainpage.ejs', { result: result, cart: cart });
  })
})

router.get('/logout', (req, res) => {

  res.clearCookie('connect-sid');
  res.redirect('/login');
});

router.get('/addnew', (req, res) => {
  res.render('addproduct.ejs');
});

router.post('/addnew', (req, res) => {
  product.create(req.body, (err, result) => {
    if (err) console.log(err);
    res.redirect('/mainpage')
  })
});

router.get('/:id/productdetails', (req, res) => {
  var id = req.params.id;
  product.findById(id, (err, result) => {
    comment.find({ productId: id }, (err, comment) => {
      res.render('productdetails.ejs', { result, comment });
    })

  });
});

router.get('/:id/edit', (req, res) => {
  var id = req.params.id;
  product.findById(id, (err, result) => {
    res.render('editproduct.ejs', { result });
  })
});

router.post('/:id/edit', (req, res) => {
  var id = req.params.id;
  product.findByIdAndUpdate(id, req.body, (err, result) => {
    res.redirect('/' + id + '/productdetails');
  })
});

router.get('/:id/delete', (req, res) => {
  var id = req.params.id;
  product.findByIdAndDelete(id, (err, result) => {
    comment.deleteMany({ productId: result._id }, (err, result) => {
      res.redirect('/mainpage');

    })
  })
});

router.post('/:id/comment', (req, res) => {
  var id = req.params.id;
  req.body.productId = id;
  comment.create(req.body, (err, result) => {
    product.findByIdAndUpdate(id, { $push: { Comments: result._id } }, (err, result) => {
      if (err) console.log(err);
      res.redirect('/' + id + '/productdetails')
    })

  })
});

router.get('/comment/edit/:id', (req, res) => {
  var id = req.params.id;
  comment.findById(id, (err, comment) => {
    res.render('editcomment.ejs', { comment: comment });
  })
});

router.post('/comment/edit/:id', (req, res) => {
  var id = req.params.id;
  comment.findByIdAndUpdate(id, req.body, (err, comment) => {

    res.redirect('/' + comment.productId + '/productdetails')
  })
});

router.get('/comment/delete/:id', (req, res) => {
  var id = req.params.id;
  comment.findByIdAndDelete(id, req.body, (err, comment) => {
    product.findByIdAndUpdate(comment.productId, { $pull: { Comments: comment._id } }, (err, result) => {
      res.redirect('/' + comment.productId + '/productdetails');

    });
  });
});

router.get('/:id/likes', (req, res) => {
  var id = req.params.id;
  product.findByIdAndUpdate(id, { $inc: { Likes: 1 } }, (err, success) => {
    if (err) console.log(err);
    res.redirect('/' + id + '/productdetails')
  })
});

router.get('/:id/cart/mainpage', (req, res) => {
  var id = req.params.id;
  product.findById(id, (err, result) => {
    if (err) console.log(err);

    var cart = req.session.cart;
    var newItem = true;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].Name == result.Name) {
        cart[i].Quantity++;
        cart[i].Price = result.Price * cart[i].Quantity;
        newItem = false;
        break;
      }
    }
    if (newItem) {
      console.log(result);
      cart.push({
        Name: result.Name,
        Quantity: result.Quantity,
        Price: result.Price,
        Image: result.Image,
        ProductID: result._id

      })
    }
    // var cart = req.session.cart;
    // req.session.cart.push({ Name: result.Name })
    // console.log(req.session.cart);
    // res.send("done");
    res.redirect('/mainpage');
  })
});

router.get('/:id/cart', (req, res) => {
  var id = req.params.id;
  product.findById(id, (err, result) => {
    if (err) console.log(err);

    var cart = req.session.cart;
    var newItem = true;

    for (var i = 0; i < cart.length; i++) {
      if (cart[i].Name == result.Name) {
        cart[i].Quantity++;
        cart[i].Price = result.Price * cart[i].Quantity;
        newItem = false;
        break;
      }
    }
    if (newItem) {
      console.log(result);
      cart.push({
        Name: result.Name,
        Quantity: result.Quantity,
        Price: result.Price,
        Image: result.Image,
        ProductID: result._id

      })
    }
    // var cart = req.session.cart;
    // req.session.cart.push({ Name: result.Name })
    // console.log(req.session.cart);
    // res.send("done");
    res.redirect('/' + id + '/productdetails');
  })
});


router.get('/:id/cart/remove', (req, res) => {

  var id = req.params.id;
  console.log(req.params.id);
  var cart = req.session.cart;
  for (var i = 0; i < cart.length; i++) {
    if (cart[i].ProductID == id) {
      cart.splice(i, 1);
    }

  }
  console.log("success");
  res.redirect('/cart');

});



router.get('/cart', (req, res) => {
  var cart = req.session.cart;
  var amount = 0;
  for (var i = 0; i < cart.length; i++) {

    amount += cart[i].Price * cart[i].Quantity;

  }
  res.render('cartUI', { cart, amount })


});


router.get('/userprofile', (req, res) => {
  res.render('userprofile.ejs');
})

router.get('/editprofile', (req, res) => {
  res.render('editprofile.ejs');
})

router.post('/editprofile', (req, res) => {
  var id = req.user._id;
  user.findByIdAndUpdate(id, req.body, (err, result) => {
    if (err) console.log(err);
    res.redirect('/userprofile');

  })
})

router.get('/:id/cart/update', (req, res) => {
  var id = req.params.id;
  var cart = req.session.cart;
  var action = req.query.action;

  for (var i = 0; i < cart.length; i++) {
    if (cart[i].ProductID == id) {
      switch (action) {
        case "plus":
          cart[i].Quantity++;
          break;
        case "minus":
          cart[i].Quantity--;
          break;
        default:
          console.log("update problem");
          break;

      }
      break;
    }
  }
  res.redirect('/cart');
})
// })

module.exports = router;
