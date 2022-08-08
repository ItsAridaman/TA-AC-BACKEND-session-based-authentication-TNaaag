var mongoose=require('mongoose');
var Schema=mongoose.Schema;


var commentSchema= new Schema(
    {
        content:{ type:String },
        productId:{ type:String },
    }
);

    
module.exports=mongoose.model('comment', commentSchema);