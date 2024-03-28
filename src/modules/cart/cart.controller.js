
//==============add product to cart=============7

import cartModel from "../../../DB/Models/cart.model.js"
import productModel from "../../../DB/Models/product.model.js"

export const addProductToCart=async (req,res,next)=>{
    const {productId,quantity} = req.body

    const { _id : userId}=req.authUser

    //check if product found and check stock
    const product=await productModel.findById(productId)
    if(!product)return next({msg : "product not found",cause:404})
    if(product.stock < quantity)return next({msg : "product not avilable",cause:400})


    //check cart
const cart=await cartModel.findOne({userId})
// if not have cart
if(!cart){
const newCartObject={
        userId,
        products:[{
            productId,
            quantity,
            basePrice:product.appliedPrice,
            finalPrice:product.appliedPrice * quantity,
            title:product.title,
        }


        ],
        subTotal:product.appliedPrice * quantity,
    }
    const newCart= await cartModel.create(newCartObject)
    return res.status(200).json(
        {
            msg:"cart add success",
            data:newCart

        }
    )
}
// if  have cart
let isProductExist=false
let subTotel=0

for (const product of cart.products) {

    if(product._id.toString()=== productId.toString()){
        
        product.quantity = quantity
        product.finalPrice = quantity * product.appliedPrice
        return isProductExist=true
    }
    
}
if(!isProductExist){
    cart.products.push({
        productId,
        quantity,
        basePrice:product.appliedPrice,
        finalPrice:product.appliedPrice * quantity,
        title:product.title,
        
    })
}

for (const product of cart.products) {
    subTotel += product.finalPrice
}
cart.subTotal = subTotel
await cart.save()
return res.status(200).json(
    {
        msg:"cart add success",
        data:cart

    }
)
}


//==============REMOVE FROM  cart=============7

export const removeFromCart= async (req,res,next)=>{
    const {productId}= req.params
    const {_id:userId}=req.authUser

    //check if product found and check stock
    const product=await productModel.findById(productId)
    if(!product)return next({msg : "product not found",cause:404})

    //check cart
    const cart =await cartModel.findOne({userId,'products.productId': productId})
    if(!cart)return next({msg : "Cart not found",cause:404})
    //filter product from cart products
    cart.products=cart.products.filter(product=>product.productId.toString() !== productId)
    //calc subTota
    let subTotel=0
    for (const product of cart.products) {
        subTotel += product.finalPrice
    }
    cart.subTotal = subTotel
   const newCart= await cart.save()
   if(newCart.products.length===0){
    await cartModel.findByIdAndDelete(cart._id)
   }
    return res.status(200).json(
        {
            msg:"product remove success",

            data:cart
        
        }
    )
}
