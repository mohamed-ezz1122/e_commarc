import { Router } from "express";
import expressAsyncHandler from "express-async-handler";
import * as PC from "./product.controller.js";
import { auth } from "../../middlewares/auth.middleware.js";
import { endPointsRoles } from "./endPoint-product.js";
import { allowedExtensions } from "../../utils/allowed-extensions.js";
import { multerMiddleHost } from "../../middlewares/multer.js";
import { systemRoles } from "../../utils/system-roles.js";

const router = Router();

router.post(
  "/",
  auth(endPointsRoles.ADD_PRODUCT),
  multerMiddleHost({ extensions: allowedExtensions.image }).array("images", 3),
  expressAsyncHandler(PC.addProduct)
);
router.put(
  "/",
   auth(systemRoles.ADMIN)
    ,multerMiddleHost({extensions:allowedExtensions.image}).array("images", 3)
    ,expressAsyncHandler(PC.updataProdct)
);

router.get("/",expressAsyncHandler(PC.getAllProducts))
export default router;
