import jwt from "jsonwebtoken"
import User from '../db/userSchema.js';
import Token from "../db/tokenSchema.js";
import session from "express-session"
const requireAuth = async (req, res, next) => {
    const reqtoken = req.cookies.jwt;
    if (!reqtoken) {
      res.redirect('/login');
      return;
    }
  
    try {
      const cookie = await Token.findOne({ token: reqtoken });
      
      if (!cookie) {
        
        res.cookie('jwt',sessioncookie, { maxAge: 1 });
        
        
        
      }
  
      jwt.verify(cookie.token, process.env.JWT_SECRET, (err, decodedToken) => {
        if (err) {
          console.log(err.message + ' - token dogrulama hatasi');
          res.redirect('/login');
        } else {
          console.log(decodedToken);
          next();
        }
      });
    } catch (error) {
      console.error('Auth middleware hata:', error);
      res.redirect('/login');
    }
  };

const blockPath = (req, res, next) => {
    const reqtoken = req.cookies.jwt;
  
    if (reqtoken) {
      return res.redirect('/');
    } else {
      next();
    }
  };





  const checkUser = async (req, res, next) => {
    const reqtoken = req.cookies.jwt;
  
    if (!reqtoken) {
      req.session.user = null;
      res.locals.user = null; // EJS'ye veri geçmek için
      next();
      return;
    }
  
    try {
      const cookie = await Token.findOne({ token: reqtoken });
  
      if (!cookie) {
        req.session.user = null;
        res.locals.user = null; // EJS'ye veri geçmek için
        next();
        return;
      }
  
      jwt.verify(cookie.token, process.env.JWT_SECRET, async (err, decodedToken) => {
        if (err) {
          console.log(err.message + ' token dogrulama hatasi');
          req.session.user = null;
          res.locals.user = null; // EJS'ye veri geçmek için
          next();
        } else {
          console.log(decodedToken);
          const user = await User.findById(decodedToken.id);
          console.log(user);
          req.session.user = user;
          res.locals.user = user; // EJS'ye veri geçmek için
          next();
        }
      });
    } catch (error) {
      console.error('checkUser middleware hatasi:', error);
      req.session.user = null;
      res.locals.user = null; // EJS'ye veri geçmek için
      next();
    }
  };






export { requireAuth, checkUser,blockPath };
