
import mongoose, { Schema, model } from "mongoose";

const reviewSchems=new Schema({

userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
productId:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
},
reviewRate:{
    type:Number,
    min:1,
    max:5,
    enum:[1,2,3,4,5],
    required:true,

},
reviewComment:String,



},{timestamps:true})


export default mongoose.models.Review || model('Review',reviewSchems)