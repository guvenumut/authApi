import mongoose from 'mongoose';


const mailTokenSchema = new mongoose.Schema({
  mailToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '15m' } // 
});

const mailToken = mongoose.model('mailToken', mailTokenSchema);


export default mailToken;