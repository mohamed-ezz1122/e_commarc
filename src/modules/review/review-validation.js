import Joi from "joi";
import { generalValidationRule } from "../../utils/general.validation.rule.js";

export const reviewValidation= { 
    body:Joi.object({
        reviewRate:Joi.number().required().max(5).min(1),
        reviewComment:Joi.string().min(5).max(255).optional()
    
}),
query:Joi.object({
    productId:generalValidationRule.dbId.required()
})
}