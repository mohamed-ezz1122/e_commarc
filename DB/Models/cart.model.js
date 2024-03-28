import mongoose, { Schema, model } from "mongoose";

const cartSchema= new Schema({
    userId:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",
        required:true
    },
    products:[
        {
            productId:{
                type:mongoose.Schema.Types.ObjectId,ref:"User",
                required:true
        },
        quantity:{
            type:Number,
            required:true,
            default:1
        },
        basePrice:{
            type:Number,
        required:true,
        },
        finalPrice:{
            type:Number,
        required:true,
        },
        title:{
            type:String,
        required:true,
        },
    }
    ],
    subTotal:{
        type:Number,
        required:true,
        default:0,


    }
},{
    timestamps:true
})
export default mongoose.models.Cart || model('Cart',cartSchema)