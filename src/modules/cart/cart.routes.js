
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as CC from "./cart.controller.js";
import { cartEndPoint } from "./endPoint.cart.js";
const router = Router();


router.post('/',auth(cartEndPoint.createCart),expressAsyncHandler(CC.addProductToCart))
router.put('/',auth(cartEndPoint.createCart),expressAsyncHandler(CC.removeFromCart))







export default router;