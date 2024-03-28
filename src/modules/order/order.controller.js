import cartModel from "../../../DB/Models/cart.model.js";
import orederModel from "../../../DB/Models/oreder.model.js";
import { couponValidation } from "../../utils/coupon.validation.js";
import productModel from "../../../DB/Models/product.model.js"
import { DateTime } from "luxon";
import { generateUniqueString } from "../../utils/generate-Unique-String.js";
import createInvoice from "../../utils/pdfkit.js";

export const createOrderToOneProduct = async (req, res, next) => {
  const {
    product,
    quantity,
    city,
    country,
    postCode,
    address,
    phoneNumbers,
    couponCode,
    paymentMethod,
  } = req.body;
  const { _id: user } = req.authUser;
  console.log(user);

  //check coupon
  let coupon = null;

  if (couponCode) {
    const isCouponValied = await couponValidation(couponCode, user);
    if (isCouponValied.status)
      return next(
        new Error(isCouponValied.msg, { cause: isCouponValied.status })
      );

    coupon = isCouponValied;
  }
  //check product and quantity
  const productCheck = await productModel.findById(product);
  if (!productCheck) return next({ msg: "product not found", cause: 404 });
  if (productCheck.stock < quantity)
    return next({ msg: "product not avilable", cause: 400 });

  //create Order items
  const orederItems = [
    {
      title: productCheck.title,
      price: productCheck.appliedPrice,
      quantity,
      productId: productCheck._id,
    },
  ];
  //price

  let shippingPrice = orederItems[0].price * quantity;

  let totalPrice = shippingPrice;

  //if user used coupon
if(coupon?.isFixed && coupon.couponAmount <= shippingPrice)    return next(new Error("coupon not valied ", { cause: 400 }));

  if (coupon?.isFixed) {
     totalPrice = shippingPrice - coupon.couponAmount;
  } else if (coupon?.isParcentage) {
     totalPrice =
      shippingPrice - (shippingPrice * coupon.couponAmount) / 100;
  }
  //order status
  let orderStatus;

  if (paymentMethod == "Cash") {
    orderStatus = "placed";
  }
const shippingAddress = { city, country, postCode, address }
// console.log(shippingAddress,shippingPrice);
  //oject order
  const order = new orederModel({
    user,
    product,
    quantity,
    orederItems,
    shippingPrice,
    totalPrice,
    couponCode,
    phoneNumbers,
    shippingAddress,
    orderStatus,
    paymentMethod
  });
  await order.save()


  productCheck.stock -=quantity
  await productCheck.save()
//=============invoice======>
  const orderCode =`${req.authUser.username}_${generateUniqueString(4)}`

  const orderInvoice = {
    shipping:{
      name:req.authUser.username,
      address:order.shippingAddress.address,city:"cairo",state:"cairo",country:"egp"
  
    },
    orderCode,
    
    data:order.createdAt,
    items:order.product,
    subTotal:order.totalPrice,
    paidAmount:order.paymentMethod
  }
  await createInvoice(orderInvoice,`${orderCode}.pdf`)
console.log({x: await createInvoice(orderInvoice,`${orderCode}.pdf`)});


  res.status(200).json({
    msg:"order create success",
    data:order
  })
};










///==========================================================//


export const orderToCart = async (req, res, next) => {
  const {
    
    city,
    country,
    postCode,
    address,
    phoneNumbers,
    couponCode,
    paymentMethod,
  } = req.body;
  const { _id: user } = req.authUser;
//check cart
const userCart=await cartModel.findOne({userId:user})
if(!userCart)return next({ msg: "cart not found", cause: 404 });
  //check coupon
  let coupon = null;

  if (couponCode) {
    const isCouponValied = await couponValidation(couponCode, user);
    if (isCouponValied.status)
      return next(
        new Error(isCouponValied.msg, { cause: isCouponValied.status })
      );

    coupon = isCouponValied;
  }
  //check product and quantity
  const productCheck = await productModel.findById(product);
  if (!productCheck) return next({ msg: "product not found", cause: 404 });
  if (productCheck.stock < quantity)
    return next({ msg: "product not avilable", cause: 400 });

  //create Order items
  const orederItems = userCart.products.map(cartItems=>{ return{

    title:cartItems.title,
    quantity:cartItems.quantity,
    price:cartItems.appliedPrice,
    productId:cartItems.productId

    }}
  )
  //price

  const shipingPrice = userCart.subTotal

  const totalPrice = shipingPrice;

  //if user used coupon
if(coupon?.isFixed && coupon.couponAmount <= shipingPrice)return next(new Error("coupon not valied ", { cause: 400 }));

  if (coupon?.isFixed) {
    const totalPrice = shipingPrice - coupon.couponAmount;
  } else if (coupon?.isParcentage) {
    const totalPrice =
      shipingPrice - (shipingPrice * coupon.couponAmount) / 100;
  }
  //order status
  let orderStatus;

  if (paymentMethod == "Cash") {
    orderStatus = "placed";
  }

  //oject order
  const order = new orederModel({
    user,
    orederItems,
    shipingPrice,
    totalPrice,
    couponCode,
    phoneNumbers,
    shippingAdress: { city, country, postCode, address },
    orderStatus,
    paymentMethod
  });
  await order.save()
  //delete cart
  await cartModel.findByIdAndDelete(userCart._id)
  //calc stock
  for (const product of userCart.products) {
    await productModel.updateOne({_id:product.productId},{$inc:{stock:-product.quantity}})
  }

//======INVOOICE==>

const orderCode =`${req.authUser.username}_${generateUniqueString(4)}`

const orderInvoice = {
  orderCode,
  shippping:{
    name:req.authUser.username,
    address:order.address,

  },
  data:order.createAt,
  items:order.orederItems,
  subTotal:order.subTotal,
  paidAmount:order.paymentMethod
}
  await createInvoice(orderInvoice,`${orderCode}.pdf`)
  res.status(200).json({
    msg:"order create success",
    dats:order,
    city:'zagazig',
    state:"zag",
    country:"Egypt"
  })
};

///==============================order delivered============================//

export const orderDelivered= async (req, res, next) =>{
const {orderId}=req.params
const {_id}=req.authUser
const updateOrder= await orederModel.updateOne({_id:orderId,orderStatus:{$in:['paid','placed']}},{
  orderStatus:"delivered",
  deliveredBy:_id,
  deliveredAt:DateTime.now().toFormat('yyyy-MM-dd'),
  isDelivered:true
},{
  now:true
})
if(!updateOrder)return next({ msg: "order update failed", cause: 400 });
res.status(200).json({
  msg:"order update success",
  dats:updateOrder
})
}




// export const cancelOrderAfterOneDay =async(req, res, next)=>
// {






// }