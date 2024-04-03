import express from 'express';
import dotenv from 'dotenv';
import router from './app/routes.js'
import connectDatabase from './db/connectDB.js';



dotenv.config();
connectDatabase()


const app = express();


   



app.use(express.urlencoded({ extended: true }));
app.use("/",router)






const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});