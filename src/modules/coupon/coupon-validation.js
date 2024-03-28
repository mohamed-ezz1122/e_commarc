import Joi from "joi"
import { generalValidationRule } from "../../utils/general.validation.rule.js"
export const addCouponValidation={
    body:Joi.object({
        couponCode:Joi.string().required().min(3).max(10).alphanum(),
        couponAmount:Joi.number().required().min(1),

        isFixed:Joi.boolean(),
        isParcentage:Joi.boolean(),

        fromDate:Joi.date().required().greater(Date.now()-(24*60*60*1000)),
        toDate:Joi.date().required().greater(Joi.ref('fromDate')),

        users:Joi.array().items(
            Joi.object({
                userId:generalValidationRule.dbId.required(),
                maxUsage:Joi.number().required().min(1)
            })
        )
    })
}