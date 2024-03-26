import express from 'express';
const router = express.Router();



router.get("/",(req,res)=>{
    res.status(200).json({message:"Ana Sayfa"})
})

router.get('/api/register', async (req, res) => {
    try {
      
      const existingUser = await User.findOne({ email: req.body.email });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already exists' });
      }
  
      

      
     
      
    } catch (error) {
      
    }
  });


export default router