
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as CC from "./coupon.controller.js";
import { couponEndPoints } from "./endPoint.coupon.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { addCouponValidation } from "./coupon-validation.js";
const router = Router();


router.post('/',auth(couponEndPoints.addCoupon),validationMiddleware(addCouponValidation),expressAsyncHandler(CC.addCoupon))
router.put('/:couponId',auth(couponEndPoints.addCoupon),expressAsyncHandler(CC.updateCoupon))
router.get('/getDisabledCoupon',auth(couponEndPoints.addCoupon),expressAsyncHandler(CC.getAliDisableCoupon))
router.get('/getEnableCoupon',auth(couponEndPoints.addCoupon),expressAsyncHandler(CC.getAliEnableCoupon))
router.get('/couponsHandel',auth(couponEndPoints.addCoupon),expressAsyncHandler(CC.getAllCoupon))
router.get('/getCouponById/:couponId',auth(couponEndPoints.addCoupon),expressAsyncHandler(CC.getCouponById))







export default router ;