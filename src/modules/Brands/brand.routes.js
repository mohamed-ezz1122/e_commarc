import { Router } from 'express'
import expressAsyncHandler from 'express-async-handler'
import { auth } from '../../middlewares/auth.middleware.js'
import { systemRoles } from '../../utils/system-roles.js'
import * as BU from './brand.controller.js'
import { multerMiddleLocal } from '../../middlewares/multer.js'
import { allowedExtensions } from '../../utils/allowed-extensions.js'
const router = Router()

router.post('/:subCategoryId',auth(systemRoles.ADMIN),multerMiddleLocal({
    extensions:allowedExtensions.image
}).single('image'),expressAsyncHandler(BU.addBrand))
router.put('/:brandId',auth(systemRoles.ADMIN),multerMiddleLocal({
    extensions:allowedExtensions.image
}).single('image'),expressAsyncHandler(BU.updateBrand))
router.delete('/:brandId',auth(systemRoles.ADMIN),expressAsyncHandler(BU.deleteBrand))
router.get('/',auth(systemRoles.ADMIN),expressAsyncHandler(BU.getAllBrands))

export default router
