import mongoose from 'mongoose';


const tokenSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  token: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: '3h' } // 
});

const Token = mongoose.model('Token', tokenSchema);


export default Token;