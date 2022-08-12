const mongoose = require('mongoose');
var user = require('../Models/UserModel');

module.exports = {
    userInfo: (req, res, next) => {
        var userId = req.session && req.session.userId;
        if (userId) {
            user.findById(userId, (err, result) => {
                if (err) console.log(err);
                req.user = result;
                res.locals.user = result;
                next();
            })
        }
        else {
            req.user = null;
            res.locals.user = null;
            next();
        }
    }
}