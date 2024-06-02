import express from 'express';
import User from '../db/userSchema.js';
import handleErrors from '../utils/handleErrors.js'
import jwt from "jsonwebtoken"
import Token from '../db/tokenSchema.js';
import bcrypt from "bcrypt"

const router = express.Router();


export const signup_get =("/signup",(req,res)=>{
  res.render('signup');
})

export const signup_post =('/signup', async (req, res) => {
  console.log(req.body.email,req.body.password)
  const { email, password } = req.body;
  try {
    const user = await User.create({email,password})
    const token=createToken(user._id)
    req.session.token=token
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(201).json({user:user._id});
    
                     
    
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
});





export const login_get=('/login',(req,res)=>{
  res.render('login')

})
export const login_post=("/login",async(req,res)=>{
  
  try {
    const {email,password}=req.body;
    if((email==="")){
      return res.status(400).json({ errors: handleErrors(new Error('ebb')) })
    }

    const user =await User.login(email,password)
    const token=createToken(user._id);
    if(!token){
      return res.status(400).json({ errors: handleErrors(new Error('Token olusturulmadi')) });
    }
    await new Token({ userId: user._id, token }).save();
    res.cookie('jwt',token,{httpOnly:true,maxAge:maxAge*1000});
    res.status(200).json({user:user._id});
  } catch (err) {
    const errors=handleErrors(err);
    res.status(400).json({errors});
  }
})


export const changepassword_get=("/changepassword",(req,res)=>{
  res.render("changePassword")
})

export const changepassword_post=("/changepassword", async (req, res) => {
  const reqtoken = req.cookies.jwt;
  let cookie;

  try {
    cookie = await Token.findOne({ token: reqtoken });
    if (!cookie) {
      return res.status(400).json({ errors: handleErrors(new Error('Invalid token')) });
    }
  } catch (err) {
    return res.status(500).json({ errors: handleErrors(err) });
  }

  const { password, newPassword } = req.body;

  jwt.verify(cookie.token, process.env.JWT_SECRET, async (err, decodedToken) => {
    if (err) {
      return res.status(400).json({ errors: handleErrors(new Error('Invalid token')) });
    }

    try {
      const user = await User.findOne({ _id: decodedToken.id });
      if (!user) {
        return res.status(400).json({ errors: handleErrors(new Error('User not found')) });
      }

      const passControl = await bcrypt.compare(password, user.password);
      if (!passControl) {
        return res.status(400).json({ errors: handleErrors(new Error('Guncel sifreniz yanlis')) });
      }

      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ errors: handleErrors(new Error('y')) });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      const update = { password: hashedPassword };
      const options = { new: true };

      const updatedUser = await User.findOneAndUpdate({ _id: user._id }, update, options);
      console.log('Güncellenmiş kullanıcı:', updatedUser);
      return res.status(200).json({ message: "Sifre başarıyla güncellendi" });

    } catch (err) {
      return res.status(500).json({ errors: handleErrors(err) });
    }
  });
});



  const maxAge=3*24*60*60;
  const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:maxAge
    })
  }


  export const logout_get=("/logout",async(req,res)=>{
    const token = req.cookies.jwt;
    console.log(token);
    await Token.findOneAndDelete({ token });
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  })

