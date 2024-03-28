import mongoose, { Schema, model } from "mongoose";


const couponSchema=new Schema({
couponCode:{
    type:String,
    required:true,
    lowercase:true,
    trim:true,
    unique:true
},
couponAmount:{
    type:String,
    required:true,
    min:1
},
couponStatus:{
    type:String,
    default:"valied",
    enum:["valied","inValied"]
},
isFixed:{
    type:Boolean,
    default:false
},
isParcentage:{
    type:Boolean,
    default:false
},
fromDate:{
    type:String,
    required:true
},
toDate:{
    type:String,
    required:true
},
addedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
updatedBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    
},
enable:{
    type:Boolean,
    default:false,
},
enableAt:{
    type:String,
    
},
enableBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
},
disable:{
    type:Boolean,
    default:false,
},
disableAt:{
    type:String,},
    
disableBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
},
},{timestamps:true})



export default mongoose.models.Coupon || model('Coupon',couponSchema)