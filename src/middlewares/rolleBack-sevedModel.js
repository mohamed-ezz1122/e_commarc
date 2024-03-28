
export const rolleBackSavedModels= async (req,res,next)=>{
    if(req.savedDocus){
        const {model,id} =req.savedDocus
        await model.findByIdAndDelete(id)
    }
}