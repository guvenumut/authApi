import mongoose from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcrypt';
const { isEmail } = validator;


const userSchema = new mongoose.Schema({
    email: { 
      type: String, 
      required: [true,'Email Giriniz.'],
      unique:true,
      lowercase:true,
      validate:[isEmail,'Duzgun bir email adresi yaziniz']
    },
    password: { 
      type: String, 
      required:[true,"Sifre Giriniz"],
      minLength:[6,'Sifre en az 6 karakterli olmali']

    }
  });
  userSchema.pre("save",async function(next){
    const salt = await bcrypt.genSalt();
    this.password=await bcrypt.hash(this.password,salt);
    next();
  })


  
  const User = mongoose.model('User', userSchema);

  export default User;
