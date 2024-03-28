/////////////=======================ADD REVIEW=====

import orederModel from "../../../DB/Models/oreder.model.js"
import productModel from "../../../DB/Models/product.model.js"
import reviewModel from "../../../DB/Models/review.model.js"

export const addReview = async (req,res,next)=>{
const {_id:userId}=req.authUser
const {productId}=req.query

//ckeck product 

const isProductPayed=await orederModel({userId,
'products.productId':productId,
orderStatus:"delivered"
})

if(!isProductPayed)return next(new Error("you mast payed this product first",{cause:404}))
const {reviewComment,reviewRate}=req.body

const reviewObject={reviewRate,reviewComment,userId,productId}
const review= await reviewModel.create(reviewObject)

if(!review)return  next(new Error("review created failed",{cause:401}))

const product = await productModel.findById(productId)

const reviews=await reviewModel.find({productId})
let sumOfReviews=0
for (const review of reviews) {
    sumOfReviews += review.reviewRate
}

product.rate=Number(sumOfReviews /reviews.length).toFixed(2)

await product.save()

res.status(201).json({
    msg:"success",
    data:review
    ,product
})
}

// delete review=====>

export const deleteReview = async (req,res,next)=>{

    const {productId} = req.params
 //===============================//
    const {_id:userId}=req.authUser




    const reviewDeleted = await reviewModel.findOneAndDelete({userId,productId},{new:true})
        // const isReviewExist = await reviewModel.findOne({userId})

    if(!reviewDeleted)return next(new Error("this user not have any review in this product",{cause:404}))



    res.status(200).json({
        msg:"review deleted success",
        data:reviewDeleted
    })






}


//============get all review ====>
export const getAllReview = async (req,res,next)=>{
    const reviews = await reviewModel.find().populate([{
        path:"productId"
    }
    ])
    if(reviews.length == 0)return  next(new Error("no reviews yet",{cause:401}))
    res.status(201).json({
        msg:"success",
        data:reviews
        
    })
}

