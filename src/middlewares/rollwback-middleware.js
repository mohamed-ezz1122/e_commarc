
import cloudinaryConnection from "../utils/cloudinary.js";


export const rollebackMiddleware=async (req,res,next)=>{

//check if user send data in req.file

if(req.folder){
    await cloudinaryConnection().api.delete_resources_by_prefix(req.folder)
    await cloudinaryConnection().api.delete_folder(req.folder)
}
next()



}