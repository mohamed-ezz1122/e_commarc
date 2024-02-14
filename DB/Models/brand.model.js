import { Schema, model } from "mongoose";

const brandSchema=new Schema({
    name:{
        type:String,
        required:true,
        lowercase:true,
        trim:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        trim:true
    },
    
    logo:{
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
    categoryId:{type:Schema.Types.ObjectId,ref:'Category'},
    subCategoryId:{type:Schema.Types.ObjectId,ref:'SubCategory'}

},{
    timestamps:true
})

const brandModel=model('Brand',brandSchema)

export default brandModel