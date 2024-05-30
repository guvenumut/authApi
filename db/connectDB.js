import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const connectDatabase = async () => {
  try {      
      await mongoose.connect(uri)
      console.log('Database baglantisi basarili.')
  } catch (err) {
      console.log(err)
  }
}
export default connectDatabase


