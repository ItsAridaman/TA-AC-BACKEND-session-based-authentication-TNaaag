var mongoose=require('mongoose');
var Schema=mongoose.Schema;
const bcrypt = require('bcrypt');


var UserSchema= new Schema(
    {
        Name:{ type:String },
        Username:{ type:String } ,
        Password: { type:Number } 
    }
);

// UserSchema.pre('save', function(next)
// {
//     if(this.Password)
//     {

//         bcrypt.hash(this.Password, 10, function(err, hash) {
//             // Store hash in your password DB.
//             if(err) return next(err);
//             this.Password=hash;
//             return next()
//         });
       
//     }
//     else
//     {
//         next()
//     }
   
// });

// UserSchema.methods.verifypassword=function(password,cb)
// {
//     bcrypt.compare(password,this.Password,(err,result)=>
//     {
//         return cb(err,result);
//     })
// }


   
    

module.exports=mongoose.model('user', UserSchema);