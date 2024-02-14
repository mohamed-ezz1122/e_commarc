
import { Router } from "express";
import * as authController from './auth.controller.js';
import expressAsyncHandler from "express-async-handler";
import { auth } from "../../middlewares/auth.middleware.js";
const router = Router();


router.post('/', expressAsyncHandler(authController.signUp))
router.get('/verify-email', expressAsyncHandler(authController.verifyEmail))


router.post('/login', expressAsyncHandler(authController.signIn))
router.get('/',auth() ,expressAsyncHandler(authController.userProfile))
router.put('/',auth() ,expressAsyncHandler(authController.updateUser))
router.delete('/',auth() ,expressAsyncHandler(authController.deleteUser))



export default router;