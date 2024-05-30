import express from 'express';
import User from '../db/userSchema.js';
import isEmail from '../utils/emailControl.js'
import handleErrors from '../utils/handleErrors.js'
import jwt from "jsonwebtoken"
import Token from '../db/tokenSchema.js';
import { requireAuth, checkUser, blockPath }from '../middleware/authMiddleWare.js';
const router = express.Router();




router.get("/signup",blockPath,(req,res)=>{
  res.render('signup');
})

router.post('/signup', async (req, res) => {
  console.log(req.body.email,req.body.password)
  const { email, password } = req.body;
  try {
    const user = await User.create({email,password})
    const token=createToken(user._id)
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(201).json({user:user._id});
    
                     
    
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
});





router.get('/login',blockPath,(req,res)=>{
  res.render('login')



})
router.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  try {
    const user =await User.login(email,password)
    const token=createToken(user._id);
    await new Token({ userId: user._id, token }).save();
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(200).json({user:user._id});
  } catch (err) {
    const errors=handleErrors(err);
    res.status(400).json({errors});
  }
})


router.get("/changepassword",requireAuth,(req,res)=>{
  res.render("changePassword")
})


router.post("/changepassword",async(req,res)=>{
  const {password,newPassword}=req.body
  
  try {
    

  } catch (error) {
    
  }
})

  const maxAge=3*24*60*60;
  const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:maxAge
    })
  }


  router.get("/logout",async(req,res)=>{
    const token = req.cookies.jwt;
    console.log(token);
    await Token.findOneAndDelete({ token });
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  })

export default router