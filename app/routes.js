import express from 'express';
import User from '../db/userSchema.js';
import isEmail from '../utils/emailControl.js'
import handleErrors from '../utils/handleErrors.js'
import jwt from "jsonwebtoken"

const router = express.Router();



router.get("/",(req,res)=>{
    res.render("home.ejs")
})


router.get("/signup",(req,res)=>{
  res.render('signup');
})

router.post('/signup', async (req, res) => {
    console.log('selamlar');
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


  router.get('/login',(req,res)=>{
    res.render('login')
  })

  const maxAge=3*24*60*60;
  const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:maxAge
    })
  }

export default router