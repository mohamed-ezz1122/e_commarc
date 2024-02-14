import slugify from "slugify"
import Brand from "../../../DB/Models/brand.model.js"
import SubCategory from "../../../DB/Models/sub-category.model.js"
import generateUniqueString from "../../utils/generate-Unique-String.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
//======add Brand====//


/**
 * destract data from body
 * destract ids from params
 * destract _id from authUser
 * check if categ or sub-categ found
 * check if brand found by nameBrand or subCategId
 * generate slug
 * upload logo
 * generate brandObject 
 * creaye Brand
 */
export const addBrand=async (req,res,next)=>{
    //1)destract data from body
    const{name}=req.body
    //2)destract ids from params
    const {subCategoryId}=req.params
    //3)destract _id from authUser
    const {_id}=req.authUser
    //4)check if categ or sub-categ found
    const subCategory=await SubCategory.findById(subCategoryId)
    if(!subCategory)return next (new Error('subCategory not-found',{cause:404}))
    //check it is coreact category
    if(categoryId!=subCategory.categoryId)return next (new Error(' not same category',{cause:401}))
    const category=await SubCategory.findById(subCategory.categoryId)
    if(!category)return next (new Error('category not-found',{cause:404}))
    //5)check if brand found by nameBrand or subCategId
    const brand=await Brand.findOne({name,subCategoryId})
    if(!brand)return next (new Error('Brand not-found',{cause:404}))
    //6)generate slug
    const slug=slugify(name,'-')
    //7)upload logo
    if(!req.file)return next (new Error('blease upload image',{cause:404}))

    const folderId=generateUniqueString(5)

    const{secure_url,public_id}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/${subCategory.categoryId.folderId}/subCategory/Brand/${folderId}`,
        folderId
    })
    //8)generate brand object
    const brandObject={
        name,
        slug,
        addedBy:_id,
        logo:{secure_url,public_id},
        folderId,
        categoryId:subCategory.categoryId,
        subCategoryId
    }

    const newBrand=await Brand.create(brandObject)
    return res.status(200).json({
        msg:"brand created success",
        data:newBrand
    })


}
//======update Brand====//
/**
 * ckeck if brand found
 * check if brand want chaing  subcategory and it  found or not
 * check if user want chaing name
 * chaing slug 
 * check if he want chaing logo
 * chaing secure_url
 * update brand
 * 
 * 
 * 
 */
export const updateBrand=async (req,res,next)=>{
    //1)distarcting data from req
    const {name,oldPablucId}=req.body
    const {brandId}=req.params
    const {subCategoryId}=req.query
    const {_id}=req.authUser
    //2) ckeck if brand found
    const brandCheck=await Brand.findById(brandId)
    if(!brandCheck)return next (new Error('Brand not-found',{cause:404}))
    //3)check if brand want chaing  subcategory and it  found or not
    if(subCategoryId){
        const subCatecoryCheck=await SubCategory.findById(subCategoryId)
    if(!brandChecsubCatecoryCheckk)return next (new Error('Brand not-found',{cause:404}))
    }
//4)check if user want chaing name
if(name){
    if(name==brandCheck.name)return next (new Error('enter anther brand name',{cause:401}))

    const isBrandExists=await Brand.findOne({name,subCategoryId})
    if(isBrandExists)return next (new Error('brand oready exists',{cause:400}))
}
//5)chaing slug 
const slug=slugify(name,'-')
//6)check if he want chaing logo
if(oldPablucId){
if(!req.file)return next (new Error('enter new image',{cause:404}))

const newfolderId=oldPablucId.split(`${brandCheck.folderId}/`)[1]

const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
    folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/${subCatecoryCheck.categoryId.folderId}/subCategory/Brand/${brandCheck.folderId}`,
    folderId:newfolderId
})
brandCheck.secure_url=secure_url
}
await brandCheck.save()

const updateBrand=await Brand.findOneAndUpdate({brandId},{name,slug,updatedBy:_id,categoryId:subCatecoryCheck.categoryId,subCategoryId})

return res.status(200).json({
    msg:"brand updated success",
    data:updateBrand
})


}
//======deleted Brand====//
export const deleteBrand=async (req,res,next)=>{
    const {brandId}=req.body

    //check if brand found
    const brandCheck=await Brand.findById(brandId)
    if(!brandCheck)return next (new Error('Brand not-found',{cause:404}))
    //delete logo
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER_UPLOAD}/category/${subCategory.categoryId.folderId}/subCategory/Brand/${folderId}`)
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER_UPLOAD}/category/${subCategory.categoryId.folderId}/subCategory/Brand/${folderId}`)
    //delete brand
    const brandIsDeleted=await Brand.deleteOne({brandId})
    return res.status(200).json({
        msg:"brand is deleted success",
        data:brandIsDeleted
    })
    
}

//======get all Brand====//
export const getAllBrands=async (req,res,next)=>{
    const Brands=await Brand.find()

    return res.status(200).json({
        msg:" success",
        data:Brands
    })
}
