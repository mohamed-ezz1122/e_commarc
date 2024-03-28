import Joi from "joi";


export const changePasswordValidation={
    body:Joi.object({
        oldPassword:Joi.string().required().min(6).max(20).alphanum(),
        reOldPassword:Joi.string(Joi.ref("oldPassword")).required().min(6).max(20).alphanum()
    })
}