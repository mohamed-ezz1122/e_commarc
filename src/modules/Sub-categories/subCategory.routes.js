import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import { categEndPoints } from "../Categories/categ-endPoints.js";
import * as SU from "./subCategory.controller.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { multerMiddleLocal } from "../../middlewares/multer.js";


const router=Router()

router.post('/',auth(categEndPoints.ADD_CATEG),multerMiddleLocal({
    extensions:allowedExtensions.image
}).single('image'),expressAsyncHandler(SU.addSubCategory))
router.put('/:categoryId/:subCategoryId',multerMiddleLocal({
    extensions:allowedExtensions.image
}).single('image'),auth(categEndPoints.ADD_CATEG),expressAsyncHandler(SU.updateSubCategory))
router.delete('/:subCategoryId',auth(categEndPoints.ADD_CATEG),expressAsyncHandler(SU.deleteSubCategory))
router.get('/',auth(categEndPoints.ADD_CATEG),expressAsyncHandler(SU.getAllSubCategory))



export default router 