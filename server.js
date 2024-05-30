import express from 'express';
import dotenv from 'dotenv';
import router from './app/routes.js'
import connectDatabase from './db/connectDB.js';
import cookieParser from 'cookie-parser';
import { requireAuth, checkUser, blockPath }from './middleware/authMiddleWare.js';

dotenv.config();
connectDatabase()


const app = express();


app.set('view engine', 'ejs');


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())





app.use(checkUser)
app.use("/",router)



app.get("/",requireAuth,(req,res)=>{res.render("home.ejs")})
app.get('/smoothies',requireAuth,(req,res)=>res.render("smoothies"));


const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});