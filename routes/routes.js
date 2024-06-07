import express from 'express';
import { signup_get, signup_post, login_get, login_post, changepassword_get, changepassword_post, logout_get,forgetPassword_get,forgetPassword_post,resetPassword_get,resetPassword_post } from '../controllers/authController.js';
import { requireAuth, blockPath }from '../middleware/authMiddleWare.js';
const router = express.Router();

router.get('/signup',blockPath ,signup_get);
router.post('/signup', signup_post);
router.get('/login', blockPath, login_get);
router.post('/login', login_post);
router.get("/changepassword",requireAuth,changepassword_get)
router.post("/changepassword",requireAuth,changepassword_post)
router.get('/logout', logout_get);
router.get("/forgetpassword",forgetPassword_get)
router.post("/forgetpassword",forgetPassword_post)
router.get("/passwordreset/reset",blockPath,resetPassword_get)
router.post("/passwordreset/reset",resetPassword_post)

export default router