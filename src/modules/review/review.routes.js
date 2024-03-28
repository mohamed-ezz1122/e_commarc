
import { Router } from "express";
import { auth } from "../../middlewares/auth.middleware.js";
import { systemRoles } from "../../utils/system-roles.js";
import expressAsyncHandler from "express-async-handler";
import * as RC from "./review.controller.js";
// import { cartEndPoint } from "./endPoint.review.js";
import { validationMiddleware } from "../../middlewares/validation.middleware.js";
import { reviewValidation } from "./review-validation.js";
const router = Router();


router.post('/',auth(systemRoles.USER),validationMiddleware(reviewValidation),expressAsyncHandler(RC.addReview))

router.delete('/:productId',auth(systemRoles.USER),expressAsyncHandler(RC.deleteReview))
router.get('/allReviews',auth(systemRoles.USER),expressAsyncHandler(RC.getAllReview))





export default router ;