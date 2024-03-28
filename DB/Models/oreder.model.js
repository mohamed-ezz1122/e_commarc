import mongoose, { Schema, model } from "mongoose"

const orderSchema= new Schema({
user:{
    type:Schema.Types.ObjectId,
    ref:"User",
    required:true
},
orderItems:[
    {
        title:{type:String,required:true,trim:true},
        price:{type:Number,required:true},
        quantity:{type:Number,required:true},
        productId:{
            type:Schema.Types.ObjectId,
            ref:"Product",
            required:true
        },
        
}
],
shippingAddress:{
    city:{type:String,required:true,trim:true},
    country:{type:String,required:true,trim:true},
    postCode:{type:String,required:true,trim:true},
    address:{type:String,required:true,trim:true},
},
phoneNumbers:[{type:String,required:true,}],
shippingPrice:{type:Number,required:true},
product:{
    type:Schema.Types.ObjectId,
    ref:"Product",
    required:true
},
couponCode:{
    type:String
},
totalPrice:{type:Number,required:true},

paymentMethod:{
    type:String,
    required:true,
    enum:['Cash','Stripe','Paymob'],
    
},
orderStatus:{
    type:String,
    required:true,
    enum:['paid','pending','delivered','placed','canceled'],
    default:"pending"

},
isPaid:{type:Boolean,required:true,default:false},
paidAt:{type:String },

isDelivered:{type:Boolean,required:true,default:false},
deliveredBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    // required:true
},
deliveredAt:{type:String },

canceledAt:{type:String },
canceledBy:{
    type:Schema.Types.ObjectId,
    ref:"User",
    // required:true
},



},{timestamps:true})



export default mongoose.models.Order || model('Order',orderSchema)

