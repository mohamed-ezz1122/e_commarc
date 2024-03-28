import mongoose, { Schema, model } from "mongoose";


const productSchema= new Schema({
    //string
    title:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    Slug:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    desc:{
        type:String,
        required:true,
        trim:true,
        lowercase:true,
    },
    //Numbers 
    basePrice:{
        type:Number,
        required:true,
        
    },
    descount:{
        type:Number,
        required:true,
        default:0
        
    },
    appliedPrice:{
        type:Number,
        required:true,
        default:0
        
    },
    stock:{
        type:Number,
        required:true,
        min:1
        
    },
    rate:{
        type:Number,
        required:true,
        min:0,
        max:5,
        default:0
        
    },
    //objectsId
    addedBy:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",
        required:true
    },
    updatedBy:{
        type:mongoose.Schema.Types.ObjectId,ref:"User",
        
    },
    brandId:{
        type:mongoose.Schema.Types.ObjectId,ref:"Brand",
        required:true
    },
    categoriesId:{
        type:mongoose.Schema.Types.ObjectId,ref:"Category",
        required:true
    },
    subCategoriesId:{
        type:mongoose.Schema.Types.ObjectId,ref:"SubCategory",
        required:true
    },
    //Arraies
    images:[
        {
            public_id:{ type: String, required: true, unique: true },
            secure_url:{ type: String, required: true }
        }
            
       
    ],
    spacs:[{
        type:Map,
        of:[String|Number]
    }
       
        
            
       
    ]
},{
    timestamps:true,
    toJSON:{virtuals:true}
})

productSchema.virtual('Reviews',{
    ref:"Riview",
    foreignField:'productId',
    localField:'_id'
})

export default mongoose.models.Product || model("Product",productSchema)