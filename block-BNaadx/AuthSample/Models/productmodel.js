var mongoose=require('mongoose');
var Schema=mongoose.Schema;



var ProductSchema= new Schema(
    {
        Name:{ type:String },
        Price:{ type:Number },
         Size:{ type:String},
         Description:{type:String},
         Comments: [{ type: Schema.Types.ObjectId, ref: 'comment'}],
         Likes: { type: Number, default: 0 },
         Image:{type:String},
         Quantity:{type:Number, default:1}
        }
);

    
module.exports=mongoose.model('product', ProductSchema);