import express from 'express';
import { signup_get, signup_post, login_get, login_post, changepassword_get, changepassword_post, logout_get } from '../controllers/authController.js';
import { requireAuth, blockPath }from '../middleware/authMiddleWare.js';
const router = express.Router();

router.get('/signup',blockPath ,signup_get);
router.post('/signup', signup_post);
router.get('/login', blockPath, login_get);
router.post('/login', login_post);
router.get("/changepasword",requireAuth,changepassword_get)
router.get("/changepasword",requireAuth,changepassword_post)
router.get('/logout', logout_get);
router.use((req, res) => {
    res.redirect("/")
  });

export default router