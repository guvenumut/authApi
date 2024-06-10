import nodemailer from 'nodemailer';

 const sendMail=(Email,token)=>{
    const url="http://localhost:3000/passwordreset/reset?token="+token
    try {
        const transporter = nodemailer.createTransport({
          service: 'gmail',
          host:"smtp.gmail.com",
          port: 587,
          secure: false, // use SSL
          auth: {
            user: process.env.MAIL,
            pass: process.env.PASS,
          }
        });
        
        // Configure the mailoptions object
        const mailOptions = {
          from: {
            name:"Ninja Smoothies",
            address:process.env.MAIL
          },
          to: Email,
          subject: 'Reset Your Password',
          text: "Sifre Degistirme Linki: "+url
        };
        
        // Send the email
        transporter.sendMail(mailOptions, function(error, info){
          if (error) {
            console.log( error);
          } else {
            console.log('Email sent: ' + info.response);
          }
        });
       } catch (error) {
        console.log(error);
       }
    
}

export default sendMail;