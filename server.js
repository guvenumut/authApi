import express from 'express';
import dotenv from 'dotenv';
import router from './app/routes.js'
import connectDatabase from './db/connectDB.js';
import cookieParser from 'cookie-parser';


dotenv.config();
connectDatabase()


const app = express();


   


app.use(express.static('public'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser())



app.set('view engine', 'ejs');


app.use("/",router)

app.get('/smoothies',(req,res)=>res.render("smoothies"));


const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});