import express from 'express';
import User from '../db/userSchema.js';
import isEmail from '../utils/emailControl.js'
import handleErrors from '../utils/handleErrors.js'
const router = express.Router();



router.get("/",(req,res)=>{
    res.status(200).json({message:"Ana Sayfa"})
})

router.get('/register',(req,res)=>{
  
})

router.post('/api/register', async (req, res) => {
    console.log('selamlar');
    const { email, password } = req.body;
    try {
      const user = await User.create({email,password})
      res.status(201).json(user);
      


      
    
    
    
  
      
      

      

      
     
      
    } catch (err) {
      const errors = handleErrors(err)
      res.status(400).json({errors})
    }
  });


export default router