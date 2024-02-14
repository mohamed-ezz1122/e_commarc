import slugify from "slugify"
import Category from "../../../DB/Models/category.model.js"
import generateUniqueString from "../../utils/generate-Unique-String.js"
import cloudinaryConnection from "../../utils/cloudinary.js"
//=============add categ============//
/**
 * distract data from body
 * distract _id from authUser
 * generate the slug
 * auth to now who signIn now
 * check is name oready exsists
 * update image to cloudinary
 * create category
 */


export const addCategory=async (req,res,next)=>{
    const {name}=req.body
    const {_id}=req.authUser

    //1)check isNameExists
    const isNameExists=await Category.findOne({name})
    if(isNameExists)return next (new Error("name is oready exists",{cause:401}))
    //2)create slug
    const slug=slugify(name,'-')
    //3)upload image to cloudinary
    if(!req.file)return next (new Error("name is oready exists",{cause:401}))

    const folderId=generateUniqueString(5)

    const{public_id,secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
        folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/${folderId}`
    })
    //4)generate categ object

    const categObject={name,slug,image:{secure_url,public_id},addedBy:_id,folderId}

    //5)create categ
    const category=await Category.create(categObject)
    if(!category )return (new Error("category iscreated failed",{cause:401}))

    res.states(200).json({
        msg:'categ updated success',
        data:category
    })


}

//=============update categ============//
/**
 * distract req from body
 * distract data from params
 * distract _id from authUser
 * check if categ found by categId
 * ckeck if the user wont ching the category name or slug
 * check if user wount to update the image 
 * set value for the update by filed 
 * returen success res 
 * 
 */
export const updateCateg=async  (req,res,next)=>{
    //1)dest data from req bady
    const {name,oldPublicId}=req.body
    const {categoryId}=req.params
    const {_id}=req.authUser

   
     //4)check if categ found
     const oldCateg=await Category.findById(categoryId)
     if(!oldCateg)return next(new Error("category not found",{cause:404}))
      //2)ckeck if name oready exists
   if(name){
  if(oldCateg.name===name )return  next(new Error("please enter defront category name",{cause:400}))
   }
   const isNameDuplicated = await Category.findOne({ name })
   if (isNameDuplicated) {
       return next({ cause: 409, message: 'Category name is already exist' })
   }
     //3)create slug
    const slug=slugify(name,'-')
      //5)check if user want update image
      if(oldPublicId){
        if(!req.file)return next('please upload image',{cause:401})

        const newPulicId = oldPublicId.split(`${oldCateg.folderId}/`)[1]

        const {secure_url}=await cloudinaryConnection().uploader.upload(req.file.path,{
            folder:`${process.env.MAIN_FOLDER_UPLOAD}/category/${oldCateg.folderId}`,
            folderId:newPulicId
        })
        //6)set secure_url=new secure_url
        oldCateg.secure_url=secure_url
      }
      oldCateg.updatedBy=_id

      await oldCateg.save()


       res.states(200).json({
        msg:'categ create success',
        data:oldCateg
    })




}

//=============get all categ ============//

export const getAllCateg= async (req,res,next)=>{
    const categorys=await Category.find().populate([{
        path:"SubCategory"
    }])
    if(!categorys)return next (new Error("categorys not  found",{cause:404}))
    res.states(200).json({
        msg:' success',
        data:categorys
    })

}

//=============get all categ ============//
/**
 * destract catwgId from req.params
 * ckeck if categ found
 * delete catteg image
 * delete catteg 
 */

export const deleteCateg=async (req,res,next)=>{
    //1)destract catwgId from req.params
    const {categId}=req.params
    //2)ckeck if categ found
    const category=await Category.findById(categId)
    if(!category)return next (new Error('category not found',{cause:404}))

    //3)delete catteg image
    await cloudinaryConnection().api.delete_resources_by_prefix(`${process.env.MAIN_FOLDER_UPLOAD}/category/${category.folderId}`)
    await cloudinaryConnection().api.delete_folder(`${process.env.MAIN_FOLDER_UPLOAD}/category/${category.folderId}`)
    res.status(200).json({ success: true, message: 'Category deleted successfully' })
} 