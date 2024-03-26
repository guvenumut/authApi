import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;

const client = new MongoClient(uri, {
  serverApi: {
    version: "1", 
  }
});

async function connectDB() {
  try {
    await client.connect();
    console.log('MongoDB bağlantısı başarılı');

    

  } catch (error) {
    console.error('MongoDB bağlantı hatası:', error.message);
    process.exit(1);
  } finally {
    await client.close();
  }
}

export default connectDB;