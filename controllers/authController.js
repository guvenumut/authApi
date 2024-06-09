import express from 'express';
import User from '../db/userSchema.js';
import handleErrors from '../utils/handleErrors.js'
import jwt from "jsonwebtoken"
import Token from '../db/tokenSchema.js';
import mailToken from '../db/mailToken.js';
import bcrypt from "bcrypt"
import nodemailer from 'nodemailer';

import sendMail from "../utils/sendMail.js"

const router = express.Router();


export const signup_get =("/signup",(req,res)=>{
  res.render('signup');
})

export const signup_post =('/signup', async (req, res) => {
  console.log(req.body.email,req.body.password)
  const { email, password } = req.body;
  try {
    const user = await User.create({email,password})
    res.status(201).json({user:user._id});
    
                     
    
  } catch (err) {
    const errors = handleErrors(err)
    res.status(400).json({errors})
  }
});





export const login_get=('/login',(req,res)=>{
  res.render('login')

})
export const login_post = ("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email) {
      return res.status(400).json({ errors: handleErrors(new Error('Email boş olamaz')) });
    }
    const user = await User.login(email, password);
    const token = createToken(user._id);
    if (!token) {
      return res.status(400).json({ errors: handleErrors(new Error('Token oluşturulamadı')) });
    }
    await new Token({ userId: user._id, token }).save();
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    return res.status(200).json({ user: user._id });
  } catch (err) {
    const errors = handleErrors(err);
    return res.status(400).json({ errors });
  }
});


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
      if (newPassword.length < 6) {
        return res.status(400).json({ errors: handleErrors(new Error('Yeni şifre en az 6 karakter uzunluğunda olmalıdır.'))   });
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


export const forgetPassword_get=("/forgetpassword",(req,res)=>{
  res.render("forgetPassword")
})

export const forgetPassword_post = ("/forgetpassword", async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ errors: handleErrors(new Error('Email is required')) });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json();
    }

    const jwt = await createMailToken(user.email);
    await new mailToken({ mailToken: jwt }).save();
    
    sendMail(email, jwt);

    res.status(200).json({ errors: handleErrors(new Error('ey')) });
  } catch (error) {
    res.status(500).json({ errors: handleErrors(error) });
  }
});





export const resetPassword_get = ("/passwordreset/reset", async (req, res) => {
  try {
    const { token } = req.query;
    const dbToken = await mailToken.findOne({ mailToken: token });
    console.log(dbToken);
    if (!dbToken) {
      // Token veritabanında bulunamadıysa hata mesajı gönder
      return res.redirect("/login");
    }

    // Token eşleştiyse resetPassword sayfasını render et ve token'ı gizli alanda gönder
    res.render('resetPassword', { token });
  } catch (error) {
    // Hata oluşursa hata mesajı gönder
    res.status(500).send('Sunucu hatası. Lütfen daha sonra tekrar deneyin.');
  }
});

export const resetPassword_post = ("/passwordreset/reset", async (req, res) => {
  const { password, rePassword, token } = req.body;
  console.log(token); 
  console.log("Password:", password);
  console.log("RePassword:", rePassword);
  jwt.verify(token, process.env.JWT_SECRET, async (err, decodedToken) => {
    const user = await User.findOne({email:decodedToken.email})
    const isSamePassword = await bcrypt.compare(password, user.password);
    console.log(isSamePassword);
    console.log(user);
    if (err) {
      return res.status(400).json({ errors: handleErrors(new Error('Invalid token')) });
    }
    if (password!=rePassword) {
      return res.status(400).json({ errors: handleErrors(new Error('Sifreler ayni olmalidir.')) });
    }
    
    if (isSamePassword) {
       return res.status(400).json({ errors: handleErrors(new Error('t')) });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
      const update = { password: hashedPassword };
      const options = { new: true };

    const updatedUser = await User.findOneAndUpdate({ email: user.email}, update, options);
    await mailToken.findOneAndDelete({mailToken:token})
      console.log('Güncellenmiş Sifre:', updatedUser);
      return res.status(200).json({ message: "Sifre başarıyla güncellendi" });

    
  })
  
});




  export const logout_get=("/logout",async(req,res)=>{
    req.session.destroy(err => {
      if (err) {
        return res.redirect('/');
      }
      res.clearCookie('connect.sid');
    });
    
    const token = req.cookies.jwt;
    console.log(token);
    await Token.findOneAndDelete({ token });
    res.cookie('jwt', '', { maxAge: 1 });
    res.redirect('/');
  })


  
  const maxAge=3*24*60*60;
  const createToken =(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
      expiresIn:maxAge
    })
  }

  const maxAgeMail =3*24*60*60;
  const createMailToken =(email)=>{
    return jwt.sign({email},process.env.JWT_SECRET,{
      expiresIn:maxAgeMail
    })
  }

