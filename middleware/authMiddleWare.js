import jwt from "jsonwebtoken"
import User from '../db/userSchema.js';
import Token from "../db/tokenSchema.js";

const requireAuth= async(req,res,next)=>{
    const reqtoken = req.cookies.jwt;
    console.log(reqtoken+"reqtoken");
    var cookie = await Token.findOne({token:reqtoken});   
    
    if(reqtoken){
        jwt.verify(reqtoken,process.env.JWT_SECRET,(err,decodedToken)=>{
            if(err){
                console.log(err.message+"iferr");
                res.redirect("/login")
            }else{
                console.log(decodedToken)
                next()
            }
        })
    }else{
        res.redirect("/login");
    }
}

const blockPath=(req,res,next)=>{
    const reqtoken=req.cookies.jwt;
    if(reqtoken){
        return res.redirect("/");
        
    }else{
        next();
    }
}
const isCookieExist=async(req,res)=>{
    let reqtoken=req.cookies.jwt;
    const cookie = await Token.findOne({token:reqtoken});

}

const checkUser=async(req,res,next)=>{
    const reqtoken=req.cookies.jwt
       
    
    if(reqtoken){
        jwt.verify(reqtoken,process.env.JWT_SECRET,async(err,decodedToken)=>{
            if(err){
                console.log(err.message+"iferrrasdr");
                res.locals.user=null;
                
                next();
            }else{
                console.log(decodedToken)
                let user= await User.findById(decodedToken.id);
                res.locals.user=user;
               
                next()
            }
        })
    }else{
        res.locals.user=null;
        

        next();
    }
}







export { requireAuth, checkUser,blockPath };
