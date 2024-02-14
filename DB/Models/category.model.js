
import { Schema, model } from "mongoose";

const categorySchema=new Schema({
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
    }

},{
timestamps:true,
toJSON:{virtuals:true},
toObject:{virtuals:true}
})
//irtual populate

categorySchema.virtual('subCategoryData',{
    ref:'SubCategory',
    localField:"_id",
    foreignField:"categoryId"
})
const CategoryModel=model("Category",categorySchema)

export default CategoryModel