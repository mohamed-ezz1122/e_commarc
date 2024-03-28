import User from "../../../DB/Models/user.model.js"

//==============add coupon=============7

import couponModel from "../../../DB/Models/coupon.model.js"
import userCouponModel from "../../../DB/Models/user-coupon.model.js";
import { couponValidation } from "../../utils/coupon.validation.js";
import { ApiFeatcher } from "../../utils/api-featchers.js";

export const addCoupon=async(req,res,next)=>{
    //distract data from body
    const {_id:addedBy}=req.authUser
    console.log('✔');
    const {couponCode,couponAmount,isFixed,isParcentage,fromDate,toDate,users}=req.body
    //check coupon code
    const isCouponCodeExists= await couponModel.findOne({couponCode})
    if(isCouponCodeExists)return next (new Error ("coupon code is not valied",{cause:409}))

    //check coupon type fixed or precanteg
    console.log(isFixed,isParcentage);
    if(isFixed == isParcentage)return next (new Error("coupon can be either isFixed or isParcentage ",{cause:401}))

    //check if coupon iisParcentage
    if(isParcentage){
        if(couponAmount > 100 )return next (new Error("coupon Amount must be less than 100%",{cause:409}))
    }

    const coupon= await couponModel.create({couponCode,couponAmount,isFixed,isParcentage,fromDate,toDate,addedBy})
    req.savedDocus={model:couponModel,id:coupon._id}

//check user id in array
let usersIds= []
for (const user of users) {
    usersIds.push(user.userId)
}
const usersChecks= await User.find({_id:{$in:usersIds}})

if(usersChecks.length !== usersIds.length)return next (new Error("user not found",{cause:404}))


    const couponUsers= await userCouponModel.create(users.map(ele => ({...ele,couponId:coupon._id})))

res.status(200).json(
    {
        msg:"coupon add success",
        data:coupon,
        couponUsers 
    }
)

}


//==============coupon validation apit=============7

export const couponValidationApi=async(req,res,next)=>{
    const {couponCode}=req.body
    const {_id:userId}=req.authUser

    //check coupon
const couponCheck=await couponValidation(couponCode,userId)
    // console.log(couponCheck);
    if(couponCheck.status){
        return next(new Error(couponCheck.msg,{cause:couponCheck.status}))
    }

   return res.json({
        msg:'validation test'
        ,data:couponCheck
    })
}

//==============get all disable coupon ====>

export const getAliDisableCoupon=async(req,res,next)=> {
    const {couponCode}=req.body

    const coubonsDisable = await couponModel.find({couponCode, disable:true})
    if(coubonsDisable.length == 0)return  next(new Error("no coubons Disable yet",{cause:401}))
    res.status(201).json({
        msg:"success",
        data:coubonsDisable
    })
}
export const getAliEnableCoupon=async(req,res,next)=> {
    const {couponCode}=req.body

    const coubonsEnable = await couponModel.find({couponCode, enable:true})
    if(coubonsEnable.length == 0)return  next(new Error("no coubons Enable yet",{cause:401}))
    res.status(201).json({
        msg:"success",
        data:coubonsEnable
    })
}



export const getAllCoupon = async (req, res, next) =>{
    const {page,size,sort,...search}=req.query
    const featchers =new ApiFeatcher(req.query,couponModel.find()).pagination({page,size}).sort(sort).search(search)
     const allCoupons=await featchers.mongooseQuery
  
   res.status(200).json({
     msg:"success",
     data:allCoupons
   })
   }


   export const updateCoupon = async (req, res, next) =>{
    const {couponId}=req.params
    const {couponCode,toDate,fromDate,isParcentage,isFixed,couponAmount}=req.body

    

    const coupon = await couponModel.findOne({couponId})
    if(coupon)return  next(new Error("coupon not found",{cause:404}))
//check coude
if (coupon.couponCode === couponCode) return  next(new Error("it is the same old name ",{cause:400}))
if(coupon.toDate === toDate)return  next(new Error("it is the same to date ",{cause:400}))
if(coupon.fromDate === fromDate)return  next(new Error("it is the same fromDate ",{cause:400}))
if(coupon.couponAmount === couponAmount)return  next(new Error("it is the same couponAmount ",{cause:400}))
const couponUpdate = await couponModel.findOneAndUpdate({couponId},{couponCode,toDate,fromDate,isParcentage,isFixed,couponAmount},{new:true})
    res.status(201).json({
        msg:"success",
        data:couponUpdate
    })

   }

   export const getCouponById= async (req,res,next)=>{
    const {couponId}=req.params
    const coupon = await couponModel.findOne({couponId})
    if(coupon)return  next(new Error("coupon not found",{cause:404}))
    res.status(201).json({
        msg:"success",
        data:coupon
    })

    
   
   }
   