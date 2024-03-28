import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as OC from "./order.controller.js";

const router= Router()

router.post('/',auth(systemRoles.USER),expressAsyncHandler(OC.createOrderToOneProduct))
router.post('/orederCart',auth(systemRoles.USER),expressAsyncHandler(OC.orderToCart))
router.post('/orderDelivered',auth(systemRoles.DELEVER_ROLE),expressAsyncHandler(OC.orderDelivered))

export default router