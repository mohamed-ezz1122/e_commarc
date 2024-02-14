

import slugify from "slugify"
import Category from "../../../DB/Models/category.model.js"
import SubCategory from "../../../DB/Models/sub-category.model.js"
import generateUniqueString from "../../utils/generate-Unique-String.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
//=============add sub-category ============//


/**
 * distract data from body
 * distract _id from authUser
 * generate the slug
 * auth to now who signIn now
 * check is name oready exsists
 * update image to cloudinary
 * create category
 */
export const addSubCategory=async (req,res,next)=>{
//1)distract data from body
const {name}=res.body
//2)distract data from params
const {categoryId}=req.params
//3)distract _id from authUser
const {_id}=req.authUser
//4)check if categ found 
const category=await Category.findById(categoryId)
if(!category)return (new Error("category not fond",{cause:404}))
//5)check if name exists
const isNameExists=await SubCategory.findOne(name)
if(isNameExists)return next('name is oready exists',{cause:401})
//6)generate slug
const slug=slugify(name,'-')
//7)upload image
if(!req.file)return next('plese upload image',{cause:404})
const folderId=generateUniqueString(5)

const {secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/subCategory/${folderId}`,
    folderId
})

//8)create subCateg object
const subCategObject={
    name,
    slug,
    addedBy:_id,
    categoryId,
    image:{secure_url,public_id},
    folderId,
}
//9)create Sub-Category
const subCategory=await SubCategory.create(subCategObject)
return res.status(200).json({
    msg:'subCategory created success',
     data:subCategory
})

}

//=============update sub-category ============//
/**
 * distract data from body
 * distract data form params
 * distract _id from authUser
 * check if subCategory is found
 * check if user want cheng name
 * generate the slug
 * replace image 
 * update sub
 */
export const updateSubCategory=async (req,res,next)=>{
    //1)distract data from body
const {name}=res.body
//2)distract data from params
const {categoryId,subCategoryId}=req.params
//3)distract _id from authUser
const {_id}=req.authUser

//4)check if subCateg  found 

const subCategory=await SubCategory.findById(subCategoryId)
if(!subCategory)return next (new Error("category not fond",{cause:404}))
//check categ
if(categoryId){
    if(categoryId==subCategory.categoryId)return next(new Error("enter anther category Id",{cause:404}))
    const oldCateg=await Category.findById(categoryId)
     if(oldCateg)return next(new Error("category oready exists",{cause:404}))

}
//5)check if name exists
if(name){
   if(subCategory.name==name) return next('plese enter anther name',{cause:401})
}
const isNameExists=await SubCategory.findOne(name)
if(isNameExists)return next('name is oready exists',{cause:401})
//6)generate slug
const slug=slugify(name,'-')
 //7)check if user want update image
 if(subCategoryId){
    if(!req.file)return next('please upload image',{cause:401})

    const newPulicId = oldPublicId.split(`${subCategory.folderId}/`)[1]

    const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/subCategory/${folderId}`,
        folderId:newPulicId
    })
    //8)set secure_url=new secure_url
    subCategory.secure_url=secure_url
  }
  subCategory.updatedBy=_id

  await subCategory.save()
const subCategoryUpdater=await SubCategory.updateOne({name,slug,updatedBy: _id,image:{secure_url,public_id},categoryId,folderId})

   res.states(200).json({
    msg:'categ create success',
    data:subCategoryUpdater

})

}

//=============delete sub-category ============//
export const deleteSubCategory=async (req,res,next)=>{
    const {subCategoryId}=req.params
    //check if subCatecory found
    const subCatecory=await SubCategory.findById(subCategoryId)
    if(!subCatecory)return next (new Error("Subcategory not fond",{cause:404}))
    //delete image and folder

        await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER_UPLOAD}/category/subCategory/${folderId}`)
        await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER_UPLOAD}/category/subCategory/${folderId}`)
        //delete subCategory
    const subCategDeleter=await SubCategory.deleteOne({subCategoryId})

res.states(200).json({
    msg:'success deleted',
    data:subCategDeleter

})
}

//=============get all sub-category ============//

export const getAllSubCategory=async (req,res,next)=>{
    
    const subCategories=await SubCategory.find().populate([{
        path:'subCategory'
    }])
    res.states(200).json({
        msg:' success',
        data:subCategories
    
    })
}