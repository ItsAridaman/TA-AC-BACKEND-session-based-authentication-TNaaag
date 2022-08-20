// var passport = require('passport');
// var GitHubStrategy = require('passport-github').Strategy;
// var user = require('../Models/UserModel');

// passport.use(new GitHubStrategy({
//     clientID: process.env.CLIENT_ID,
//     clientSecret: process.env.CLIENT_SECRET,
//     callbackURL: "/auth/github/callback"
// },
//     function (accessToken, refreshToken, profile, done) {


//         var Myuser = {
//             Name: profile._json.name,
//             Photo: profile._json.avatar_url
//         }

//         user.findOne({ Name: profile._json.name }, (err, result) => {
//             if (err) return done(err);
//             if (!result) {
//                 user.create(Myuser, (err, useradded) => {
//                     if (err) return done(err);
//                     return done(null, useradded);

//                 })
//             }
//             done(null, result);

//         })
//     }
// ));


// passport.serializeUser(function (user, done) {
//     return done(null, user._id);
//     console.log(user._id);
// });

// passport.deserializeUser(function (id, done) {
//     user.findById(id, function (err, user) {
//         return done(err, user);
//     });
// });