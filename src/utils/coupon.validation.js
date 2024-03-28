import { DateTime } from "luxon";
import couponModel from "../../DB/Models/coupon.model.js";
import userCouponModel from "../../DB/Models/user-coupon.model.js";

export async function couponValidation(couponCode,userId){

const coupon =await couponModel.findOne({couponCode})
if(!coupon)return {msg:"coupon is not valide" ,status:409}
//check coupon status

if(coupon.couponStatus == "inValied" || DateTime.fromISO(coupon.toDate)< DateTime.now())return {msg:"coupon is expired" ,status:409}

//check start coupon 

if(DateTime.fromISO(coupon.fromDate) > DateTime.now())return {msg:"coupon is not started yet" ,status:409}

//user cases

const isUserCouponAssgined = await userCouponModel.findOne({couponId:coupon._id,userId})
if(!isUserCouponAssgined)return {msg:"this coupon is not assgined to you" ,status:409}

// if(isUserCouponAssgined.maxUsage )

//check usageCount
if (isUserCouponAssgined.usageCount >= isUserCouponAssgined.maxUsage){
    coupon.disable = true
    coupon.disableAt= DateTime.now("yyyy-MM-dd")
    coupon.disableBy = userId
    await coupon.save()
    return {msg:"this coupon is finshed to you" ,status:409}

}
coupon.enable = true
    coupon.enableAt= DateTime.now("yyyy-MM-dd")
    coupon.enableBy = userId
    await coupon.save()

    

//enabled coubon


return coupon




}