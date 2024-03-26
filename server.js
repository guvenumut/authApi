import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db/connectDB.js';
import router from './app/routes.js'


dotenv.config();

connectDB();

const app = express();


app.use(express.urlencoded({ extended: true }));
app.use("/",router)






const PORT = process.env.PORT ;
app.listen(PORT, () => {
  console.log(`Sunucu ${PORT} portunda başlatıldı`);
});