var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcrypt');


var UserSchema = new Schema(
    {
        Name: { type: String, unique:true },
        Username: { type: String },
        Password: { type: String },
        IsAdmin:{type:Boolean, default:false},
        Photo:{type:String}
    }
);

// UserSchema.pre('save', function (next) {
//     if (this.Password && this.isModified('Password')) {
//         console.log(this.Password);

//         bcrypt.hash(this.Password, 10, function (err, hashed) {
//             // Store hash in your password DB.
//             if (err) return next(err);
//             this.Password = hashed;
//             console.log(hashed);
//             return next();
//         });

//     }
//     else {
//         next()
//     }

// });

// UserSchema.methods.verifypassword = function (password, cb) {
//     bcrypt.compare(password, this.Password, (err, result) => {
//         return cb(err, result);
//     })
// }





module.exports = mongoose.model('user', UserSchema);