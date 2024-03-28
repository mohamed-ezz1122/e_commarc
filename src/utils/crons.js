import { scheduleJob } from "node-schedule";
import couponModel from "../../DB/Models/coupon.model.js";
import { DateTime } from "luxon";
import orederModel from "../../DB/Models/oreder.model.js";

export function replaceCouponStatus(){

scheduleJob('* * */24 * * *',async()=>{

    const coupons =await couponModel.find({couponStatus:"valied"})

    for (const coupon of coupons) {
        
        if(DateTime.fromISO(coupon.toDate)< DateTime.now()){
            coupon.couponStatus="inValied"
        }
        await coupon.save()
    }
    // for (const coupon of coupons) {
        
    //     if(DateTime.fromISO(coupon.toDate)< DateTime.now() && ){
    //         coupon.couponStatus="inValied"
    //     }
    //     await coupon.save()
    // }

// console.log(coupons );
})


}


///////=========cancel order after 24 h====>


export function replaceOrderStatus(){

    scheduleJob('* * */24 * * *',async()=>{
    
        const orders =await orederModel.find({orderStatus:"pending"})
    
        for (const order of orders) {
            
            if(order.orderStatus == "pending"){


                order.orderStatus = "canceled"


            }
            await orders.save()
        }
    
    // console.log(coupons );
    })

}




