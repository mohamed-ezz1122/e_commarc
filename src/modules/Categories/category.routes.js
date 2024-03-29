import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
import * as CU from "./category.contoller.js";
import { categEndPoints } from "./categ-endPoints.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { multerMiddleLocal } from "../../middlewares/multer.js";
import { systemRoles } from "../../utils/system-roles.js";

const router=Router()

router.post('/',auth(systemRoles.SUPE_ADMIN),multerMiddleLocal({
    
    extensions: allowedExtensions.image
}).single('image'),expressAsyncHandler(CU.addCategory))
router.put('/:categoryId',multerMiddleLocal({
    
    extensions: allowedExtensions.image
}).single('image'),auth(categEndPoints.ADD_CATEG),expressAsyncHandler(CU.updateCateg))
router.delete('/:categId',auth(categEndPoints.ADD_CATEG),expressAsyncHandler(CU.deleteCateg))

router.get('/',auth(categEndPoints.ADD_CATEG),expressAsyncHandler(CU.getAllCateg))
router.get('/categories',expressAsyncHandler(CU.getAllCategors))
router.get('/:categId',expressAsyncHandler(CU.getCategoryById))







export default router