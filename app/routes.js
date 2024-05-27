import express from 'express';
import User from '../db/userSchema.js';
import isEmail from '../utils/emailControl.js'
import handleErrors from '../utils/handleErrors.js'
import jwt from "jsonwebtoken"

const router = express.Router();




router.get("/signup",(req,res)=>{
  res.render('signup');
})

router.get('/login',(req,res)=>{
  res.render('login')

})
router.post("/login",async(req,res)=>{
  const {email,password}=req.body;
  try {
    const user =await User.login(email,password)
    const token=createToken(user._id);
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(200).json({user:user._id});
  } catch (err) {
    const errors=handleErrors(err);
    res.status(400).json({errors});
  }
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


  const maxAge=3*24*60*60;
  const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:maxAge
    })
  }


  router.get("/logout",(req,res)=>{
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  })

export default router