import bcrypt, { hash } from 'bcrypt'
import jwt from 'jsonwebtoken'

import User from "../../../DB/Models/user.model.js"


import sendEmailService from "../Services/verify-services.module.js"
import userModel from '../../../DB/Models/user.model.js'
import { generateUniqueString } from '../../utils/generate-Unique-String.js'
// ========================================= SignUp API ================================//

/**
 * destructuring the required data from the request body
 * check if the user already exists in the database using the email
 * if exists return error email is already exists
 * password hashing
 * create new document in the database
 * return the response
 */
export const signUp = async (req, res, next) => {
   //1) distruct req from body
   const {username,email,password,phoneNumbers,addresses,role,age}=req.body
   //2)check email 
   const isEmailExists=await User.findOne({email})
   if(isEmailExists)return next({cause:401,msg:"email is already exists"})
   //3)end confirmation email to the user
    // generate login token
    const token = jwt.sign({ email }, process.env.JWT_SECRET_VERFICATION, { expiresIn: '1h' })
    

   const isEmailSend= await sendEmailService({
    
        to: email,
        subject: 'Email Verification',
        message: `
        <h2>please clich on this link to verfiy your email</h2>
        <a href="${req.protocol}://${req.headers.host}/auth/verify-email?token=${token}">Verify Email</a>
        ` 
   })
//    console.log("===============");
   //check isEmail send
   if(!isEmailSend)return next({cause:500,msg:"Email is not sent, please try again later"})
   //4)paswword hashing

   const hashPassword=bcrypt.hashSync(password,+process.env.SALT_ROUNDS)

   const userObject={username,email,password:hashPassword,phoneNumbers,addresses,role,age}

   const newUser=await User.create(userObject)
   if(!newUser)return next({cause:400,msg:"user create failed"})

    return res.status(200).json({
msg:"success ",
newUser
})


}


/**
 * Twilio => paid service
 * nodemailer => free service
 */

// ========================================= Verify Email API ================================//
/**
 * destructuring token from the request query
 * verify the token
 * get uset by email , isEmailVerified = false
 * if not return error user not found
 * if found
 * update isEmailVerified = true
 * return the response
 */
export const verifyEmail = async (req, res, next) => {
    //1)send email in query
    const { token } = req.query
    const decodedData = jwt.verify(token, process.env.JWT_SECRET_VERFICATION)
    //2)check  if user fond by search by email and isEmailVarified

    const user=await User.findOneAndUpdate({email:decodedData.email,isEmailVerified:false},{isEmailVerified:true},{new:true})
    if(!user)return next(new Error("user not found",{cause:404}) )
    return res.status(200).json({
msg:"success verified",
user
})
}


// ========================================= SignIn API ================================//

/**
 * destructuring the required data from the request body 
 * get user by email and check if isEmailVerified = true
 * if not return error invalid login credentails
 * if found
 * check password
 * if not return error invalid login credentails
 * if found
 * generate login token
 * updated isLoggedIn = true  in database
 * return the response
 */

export const signIn = async (req, res, next) => {
    const { email, password } = req.body
    // get user by email
    const user = await User.findOne({ email, isEmailVerified: true })
    if (!user) {
        return next(new Error('Invalid login credentails', { cause: 404 }))
    }
    // check password
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
        return next(new Error('Invalid login credentails', { cause: 400 }))
    }

    // generate login token
    const token = jwt.sign({ email, id: user._id }, process.env.JWT_SECRET_LOGIN, { expiresIn: '1d' })
    // updated isLoggedIn = true  in database
    user.token=token

    user.isLoggedIn = true
    await user.save()

    res.status(200).json({
        success: true,
        message: 'User logged in successfully',
         token
            })
}
// ========================================= user profile ================================//

/**
 * destructuring _id from userAuth
 * check if user fond 
 * filed res
 * success res and select
 */
export const userProfile =async (req, res, next) =>{
    const {_id}=req.authUser

    //ckeck if user found
    const user=await User.findById(_id).select(['userName',"email",'role','phoneNumbers','-_id'])
    if(!user)return next(new Error("user not found",{cause:404}) )
    return res.status(200).json({
        msg:"success verified",
        user
        })
}
// ========================================= updateUser API ================================//
/**
 * destructuring _id from userAuth
 * destructuring data is update from body
 * check if user fond 
 * ckeck is email dablecate
 * create up date object
 * update user
 */
export const updateUser =async (req, res, next) =>{

    const {username,phoneNumbers,role,age,addresses,email}=req.body
    const {_id}=req.authUser
    //1)ckeck if user found

    const user=await User.findById(_id)
    if(!user)return next(new Error("user not found",{cause:404}) )

    //2)ckeck if email doublecate
    const isEmailExists=await User.findOne({email})
    if(isEmailExists)return next(new Error("email oready exists",{cause:404}) )

    //3)create update object
    const updateObject={username,phoneNumbers,role,age,addresses,email}

    const updaterUser=await User.updateOne(updateObject,{new:true})
    return res.status(200).json({
        msg:"success update",
        user:{updaterUser}
        })



}

// ========================================= deleteUser API ================================//
/**
 *  destructuring _id from userAuth
 *  check if user fond 
 * delete user
 */
export const deleteUser=async (req, res, next) =>{
    const {_id}=req.authUser
//ckeck if user found
    const user=await User.findOne(_id).select(['userName',"email",'role','phoneNumbers','-_id'])
    if(!user)return next(new Error("user not found",{cause:404}) )
//delete user
    const userDeleted=await User.deleteOne({_id},{new:true})
    return res.status(200).json({
        msg:'deleted success',
        data:userDeleted
    })
}




export const emailResat=async(req,res,next)=>{
    const {email}=req.body

    //check user is found
    const user= await userModel.findOne({email})
    if(!user)return next({cause:404,msg:"user not found"})


    //generate token to send code to email
const code=generateUniqueString(4)
const hashCode =bcrypt.hashSync(code,+process.env.SALT_ROUNDS)
    const token=jwt.sign({code:hashCode,email},process.env.REST_SIGNTCHER,{ expiresIn: '1h' })

    const isEmailSend= await sendEmailService({
    
        to: email,
        subject: ' Reset Password',
        message: `
        <h2>please clich on this link to verfiy your email</h2>
        <a href="${req.protocol}://${req.headers.host}/auth/resetPassword?token=${token}">Rest Password</a>
        ` 
   })
   if(!isEmailSend)return next({cause:500,msg:"Email is not sent, please try again later"})

  const userupdated= await userModel.findOneAndUpdate({email},{forgetCode:hashCode},{new:true})


   res.status(200).json({
    msg:"Done",
    data:userupdated
   })


}



export const resetPassword = async(req,res,next)=>{
const {token} = req.params
const decodedToken=jwt.verify(token,process.env.REST_SIGNTCHER)

const user =await userModel.findOne({email:decodedToken?.email,forgetCode:decodedToken?.code})
if(!user)return next(new Error("user not found",{cause:404}))


const {newPassword}=req.body

 user.password = newPassword
 user.forgetCode =null

await user.save()

res.status(200).json({
    msg:"Success ",
    data:user
})




}





export const changePassword = async(req,res,next)=>{
    const {oldPassword, reOldPassword} = req.body
    const {_id :userId}=req.authUser

    const user =await userModel.findById(userId)

    const isPasswordMatshing= bcrypt.compareSync(oldPassword,user.password)

    if(!isPasswordMatshing)return next(new Error("password not correct",{cause:400}))

    user.password=oldPassword
    await user.save()

    res.status(200).json({
        msg:"password update success",
        data:user
    })

}



