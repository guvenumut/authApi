import mongoose from 'mongoose';


const mailTokenSchema = new mongoose.Schema({
  mailToken: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '3h' } // 
});

const mailToken = mongoose.model('mailToken', mailTokenSchema);


export default mailToken;