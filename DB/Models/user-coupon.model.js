import mongoose, { Schema, model } from "mongoose";

const userCouponSchema=new Schema({
couponId:{
    type:Schema.Types.ObjectId,
    ref:"Coupon",
    required:true
},
userId:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
maxUsage:{
    type:Number,
    required:true,
    min:1
},
usageCount:{
    type:Number,
    
    default:0
},



},{timestamps:true})


export default mongoose.models.UserCoupon || model('UserCoupon',userCouponSchema)