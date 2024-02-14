import { Schema, model } from "mongoose";

 const supCategorySchema=new Schema({
    name:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    image:{
        secure_url:{type:String,required:true},
        public_id:{type:String,required:true,unique:true}
    },
    folderId:{type:String,required:true,unique:true},
    addedBy:{
        type:Schema.Types.ObjectId,ref:'User'
    },
    updatedBy:{
        type:Schema.Types.ObjectId,ref:'User'
    },
    categoryId:{
        type:Schema.Types.ObjectId,ref:'Category',required:true,
    }
 },{
    timestamps:true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
 })
 supCategorySchema.virtual("brands",{
    ref:"Brand",
    localField:"_id",
    foreignField:"subCategoryId"

 })

 const subCategoryModel=model('SubCategory',supCategorySchema)
 export default subCategoryModel