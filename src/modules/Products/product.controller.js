//==========add-prouducts==========//

import slugify from "slugify";
import { systemRoles } from "../../utils/system-roles.js";
import cloudinaryConnection from "../../utils/cloudinary.js";
import { generateUniqueString } from "../../utils/generate-Unique-String.js";
import brandModel from "../../../DB/Models/brand.model.js";
import productModel from "../../../DB/Models/product.model.js";
import { ApiFeatcher } from "../../utils/api-featchers.js";

/**
 * distract data from bady
 * create sluge
 * disract user id from auth user
 * distract ids from req.query
 * check if user he add product isOwner of brand or SuberAdmin
 * check if you have dicount to calc applied price
 * upload image
 * rolle back
 * create product object
 * rolleBack of create
 * return success respons
 */

export const addProduct = async (req, res, next) => {
  // distract data from bady
  const { title, desc, basePrice, descount, stock, rate } = req.body;
  // distract ids from req.query
  const { subCategoriesId, categoriesId, brandId } = req.query;
  // disract user id from auth user
  const { _id: addedBy } = req.authUser;
  // create sluge
  const Slug = slugify(title, "-");
  //ckeck brand
  // console.log({"brand":brandId});
  const brandCheck = await brandModel.findById(brandId);
  if (!brandCheck) return next({ msg: "brand not found ", caues: 404 });
  // console.log("✔");
  // check if user he add product isOwner of brand or SuberAdmin
  if (
    brandCheck.addedBy.toString() !== addedBy.toString() &&
    authUser.role !== systemRoles.SUPE_ADMIN
  )
    return next({
      msg: "you are not brand owner not allowed to you  ",
      caues: 401,
    });
  //ckeck catego or sub-category
  if (brandCheck.categoryId.toString() !== categoriesId.toString())
    next({ msg: "not same categories ", caues: 400 });
  if (brandCheck.subCategoryId.toString() !== subCategoriesId.toString())
    return next({ msg: "not same Sub-categories ", caues: 400 });
  // check if you have dicount to calc applied price
  const appliedPrice = basePrice - (basePrice * (descount || 0)) / 100;
  //images
  //    console.log(req.files);
  if (!req.files?.length)
    return next({ cause: 400, message: "Images are required" });

  const  Images = [];

  const folderId = generateUniqueString(5);
  const folderPath = brandCheck.logo.public_id.split(
    `${brandCheck.folderId}/`
  )[0];
  for (const file of req.files) {
    const { secure_url, public_id } =
      await cloudinaryConnection().uploader.upload(file.path, {
        folder: folderPath + `${brandCheck.folderId}/product/${folderId}`,
      });
      Images.push({  public_id,secure_url })
  }
  // console.log(Images[0].public_id);

  //rolle back upload
  req.folder = folderPath + `${brandCheck.folderId}/Product/${folderId}`;
  //=============================//

  const productObject = {
    title,
    Slug,
    desc,
    stock,
    rate,
    appliedPrice,
    basePrice,
    descount,
    images:Images,
    addedBy,
    categoriesId,
    brandId,
    subCategoriesId,
  };
  //create product

  const newProducts = await productModel.create(productObject);
  req.savedDocus = { model: productModel, id: newProducts._id };
  res.json({
    msg: "success",
    newProducts,
  });
};

export const updataProdct = async (req, res, next) => {
  const { title, desc, stock, rate, specs, basePrice,oldePublicId } = req.body;
  const userId = req.authUser._id;
  const { productId } = req.params;
  //ckeck if product found
  const productCheck = await productModel.findById(productId);
  if (!productCheck) return next({ msg: "Product not found ", caues: 404 });
  //ckeck if name == old name
  if (title) {
    productCheck.title = title;
    productCheck.Slug = slugify(title, { lower: true, replacement: "-" });
  }
  if (desc) productCheck.desc = desc;
  if (specs) productCheck.specs = JSON.parse(specs);
  if (stock) productCheck.stock = stock;
  //check role

  if (
    req.authUser.role !== systemRoles.ADMIN &&
    productCheck.addedBy.toString() !== addedBy.toString()
  )
    return next({
      cause: 403,
      message: "You are not authorized to update this product",
    });
    // prices changes
const appliedPrice =
(basePrice || productCheck.basePrice) *
(1 - (discount || productCheck.discount) / 100);
productCheck.appliedPrice = appliedPrice;
if (basePrice) productCheck.basePrice = basePrice;
if (discount) productCheck.discount = discount;
//rate
if(rate){
    productCheck.rate=rate
    
}

//image
if(oldePublicId){

  if (!req.files) return next({ cause: 400, message: 'Please select new image' })

  const folderPath = product.Images[0].public_id.split(`${product.folderId}/`)[0]
  const newPublicId = oldPublicId.split(`${product.folderId}/`)[1]

  // console.log('folderPath', folderPath)
  // console.log('newPublicId', newPublicId)
  // console.log(`oldPublicId`, oldPublicId);

  const { secure_url } = await cloudinaryConnection().uploader.upload(req.file.path, {
      folder: folderPath + `${productCheck.folderId}`,
      public_id: newPublicId
  })
  productCheck.Images.map((img) => {
      if (img.public_id === oldPublicId) {
          img.secure_url = secure_url
      }
  })
  req.folder = folderPath + `${productCheck.folderId}`

}
await productCheck.save()
res.status(200).json({ success: true, message: 'Product updated successfully', data: productCheck })

};

//=========get all products
export const getAllProducts = async (req, res, next) =>{
 const {page,size,sort,...search}=req.query
 const featchers =new ApiFeatcher(req.query,productModel.find()).pagination({page,size}).sort(sort).search(search)
  const allProducts=await featchers.mongooseQuery
//sort is string 'sort desc or asc ' replace to {sort : -1 or 1}

// console.log({[key]:value});
// console.log(formela);
// const allProducts=await productModel.find().sort({[key]:value})
res.status(200).json({
  msg:"success",
  data:allProducts
})
}

export const getAllProductWithRate=async(req,res,next)=>{
 const products= await productModel.find().populate([
    {path:'Reviews'}
  ])
  res.status(201).json({
    msg:'done',
    data:products
  })
}
