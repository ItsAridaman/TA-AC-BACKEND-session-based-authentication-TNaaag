var mongoose = require('mongoose');
var user = require('../Models/UserModel');

module.exports = {
    userInfo: (req, res, next) => {
        if(req.session.passport)
        {
            var userId=req.session && req.session.passport.user;
            user.findById(userId, (err, result) => {
                if (err) console.log(err);
                req.userdetail = result;
                res.locals.userdetail = result;

                next();
            })
        }
        else if(!req.session.passport){
            var userId=req.session && req.session.userId;
            user.findById(userId, (err, result) => {
                if (err) console.log(err);
                req.userdetail = result;
                res.locals.userdetail = result;

                next();
            })
        }
             else {
            req.userdetail = null;
            res.locals.userdetail = null;
            next();
        }
    },

    isUserLoggedIn: (req, res, next) => {
        var userId =req.session && req.session.userId;
        if (userId) {
            next();
        }
        else {
            res.redirect('/login');
        }
    }
}



